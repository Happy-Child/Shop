import { defaultUserData, roles } from '@/utils/config';
import { auth, firestore, storage } from '@/services/firebase';
import Cookie from 'js-cookie';
import {
  SET_USER,
  CLEAR_USER,
  USER_LOADING,
  CLEAR_ORDERS,
} from '@/utils/mutations-types';

const path_users = process.env.path_users_images;

export const state = () => ({
  user: {...defaultUserData},
  user_loading: true,
});

export const getters = {
  isAuth: state => !!state.user.uid,
  isAdmin: state => state.user.role === roles.ADMIN,
  isDefaultUser: state => state.user.role === roles.DEFAULT_USER,
}

export const actions = {
  async setUserDataOnDB({ commit }, userData) {
    try {
      await firestore.collection('users').doc(userData.uid).set(userData);
    }
    catch(error) {
      throw error;
    }
  },

  async uploadUserImageAndGetSrc({ state, commit }, file) {
    let storageRef = storage.ref();
    const curImageName = state.user.imageName;
    const deleteCurImage = curImageName !== process.env.default_user_image;

    if(typeof file === 'object') {
      if(deleteCurImage) {
        try {
          await storageRef.child(`${path_users}/${curImageName}`).delete();
        } catch(error) {}
      }

      await storageRef.child(`${path_users}/${file.name}`).put(file);
      storageRef = storageRef.child(`${path_users}/${file.name}`);
    }
    else if(typeof file === 'string') {
      storageRef = storageRef.child(`${path_users}/${file}`);
    }

    const imageSrc = await storageRef.getDownloadURL();
    return imageSrc;
  },

  async getUserDataOnDB({ commit, dispatch }, uid) {
    try {
      commit(USER_LOADING, true);

      const user = await firestore.collection('users').doc(uid).get();
      const userData = user.data();

      if(user.exists) {
        commit(SET_USER, userData);
      }

      commit(USER_LOADING, false);
    }
    catch(error) {
      commit(USER_LOADING, false);
      throw error;
    }
  },

  async login({ getters, commit, dispatch }, formData) {
    commit(USER_LOADING, true);

    if(this.getters['users/isAuth']) {
      throw { message: 'You are already in the system!' };
    }

    try {
      await auth.signInWithEmailAndPassword(formData.email, formData.password);
      const token = await auth.currentUser.getIdToken();
      Cookie.set(process.env.access_token, token);

      const { uid } = auth.currentUser;

      await dispatch('getUserDataOnDB', uid);
    }
    catch(error) {
      commit(USER_LOADING, false);
      throw error;
    }
  },

  async registration({ commit, dispatch }, formData) {
    if(this.getters['users/isAuth']) {
      throw { message: 'You are already in the system!' };
    }

    try {
      await auth.createUserWithEmailAndPassword(formData.email, formData.password);
      const { uid } = await auth.currentUser;

      const imageSrc = await dispatch('uploadUserImageAndGetSrc', defaultUserData.imageName);

      await dispatch('setUserDataOnDB', {
        ...defaultUserData,
        imageSrc,
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        uid,
        created_at: Date.now()
      })
    }
    catch(error) {
      throw error;
    }
  },

  async logout({ commit }) {
    try {
      await auth.signOut();
      Cookie.remove(process.env.access_token);

      commit(CLEAR_USER);
      commit(`cart/${CLEAR_ORDERS}`, null, { root: true });
      commit(USER_LOADING, true);
    }
    catch(error) {
      throw error;
    }
  },

  async recoveryPassword({ commit }, formData) {
    try {
      await auth.sendPasswordResetEmail(formData.email);
    }
    catch(error) {
      throw error;
    }
  },

  async userUpdate({ commit, state, dispatch }, userData) {
    try {
      commit(USER_LOADING, true);

      await auth.currentUser.updateEmail(userData.data.email);

      if(userData.file) {
        const imageSrc = await dispatch('uploadUserImageAndGetSrc', userData.file);
        userData.data.imageSrc = imageSrc;
      }

      await firestore.collection('users').doc(userData.data.uid).update(userData.data);
      await dispatch('getUserDataOnDB', userData.data.uid);
    }
    catch(error) {
      commit(USER_LOADING, false);
      throw error;
    }
  },
}

export const mutations = {
  [SET_USER](state, user) {
    if(!!user) state.user = user;
  },

  [CLEAR_USER](state) {
    state.user = {...defaultUserData};
  },

  [USER_LOADING](state, loading) {
    state.user_loading = loading;
  }
}
