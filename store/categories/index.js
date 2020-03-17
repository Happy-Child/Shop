import { defaultCategoryData } from '@/utils/config';
import categoriesTransformation from '@/data_transformation/categories'
import { auth, firestore } from '@/services/firebase';
import {
  SET_CATEGORIES,
  CLEAR_CATEGORIES,
  CATEGORIES_LOADING,
} from '@/utils/mutations-types';

export const state = () => ({
  categories: [],
  categories_loading: true,
});

export const getters = {
  getCategoryById: state => id => state.categories.find(item => item.id === id),
}

export const actions = {
  async getCategories({ commit }) {
    try {
      commit(CATEGORIES_LOADING, true);
      const categories = await firestore.collection('categories').orderBy('created_at', 'desc').get();

      commit(SET_CATEGORIES, categories.docs);
      commit(CATEGORIES_LOADING, false);
    }
    catch(error) {
      commit(CATEGORIES_LOADING, false);
      throw error;
    }
  },

  async getCategoryById({ commit }, id) {
    try {
      commit(CATEGORIES_LOADING, true);
      const category = await firestore.collection('categories').doc(id).get();
      commit(CATEGORIES_LOADING, false);

      if(category.exists) {
        return category.data();
      } else {
        return null;
      }
    }
    catch(error) {
      commit(CATEGORIES_LOADING, false);
      throw error;
    }
  },

  async createCategory({ commit, rootState, dispatch }, formData) {
    try {
      commit(CATEGORIES_LOADING, true);

      await firestore.collection('categories').doc().set({
        ...defaultCategoryData,
        ...formData,
        creator_id: rootState.users.user.uid,
        created_at: Date.now()
      });

      await dispatch('getCategories');
    }
    catch(error) {
      commit(CATEGORIES_LOADING, false);
      throw error;
    }
  },

  async updateCategory({ commit, dispatch }, data) {
    try {
      commit(CATEGORIES_LOADING, true);

      await firestore.collection('categories').doc(data.id).update(data.formData);
      await dispatch('getCategories');
    }
    catch(error) {
      commit(CATEGORIES_LOADING, false);
      throw error;
    }
  },

  async hasProducts({}, id) {
    const products = await firestore.collection('products').where("category_id", "==", id).get();
    return products.docs.length;
  },

  async deleteCategory({ commit, dispatch }, id) {
    try {
      commit(CATEGORIES_LOADING, true);

      const hasProducts = await dispatch('hasProducts', id);
      if(hasProducts) throw { message: 'You cannot delete a category in which there are products!' };

      await firestore.collection('categories').doc(id).delete();
      await dispatch('getCategories');
    }
    catch(error) {
      commit(CATEGORIES_LOADING, false);
      throw error;
    }
  }
}

export const mutations = {
  [SET_CATEGORIES](state, categories) {
    state.categories = categoriesTransformation(categories);
  },

  [CLEAR_CATEGORIES](state) {
    state.categories = [];
  },

  [CATEGORIES_LOADING](state, loading) {
    state.categories_loading = loading;
  }
}
