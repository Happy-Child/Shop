import { defaultProductData } from '@/utils/config';
import productsTransformation from '@/data_transformation/products'
import { auth, firestore, storage } from '@/services/firebase';
import {
  SET_PRODUCTS,
  CLEAR_PRODUCTS,
  PRODUCTS_LOADING,
} from '@/utils/mutations-types';

const path_products = process.env.path_products_images;

export const state = () => ({
  products: [],
  products_loading: true,
});

export const getters = {

}

export const actions = {
  async getProducts({ commit }) {
    try {
      commit(PRODUCTS_LOADING, true);

      const products = await firestore.collection('products').orderBy('created_at', 'desc').get();

      commit(SET_PRODUCTS, products.docs);
      commit(PRODUCTS_LOADING, false);
    }
    catch(error) {
      commit(PRODUCTS_LOADING, false);
      throw error;
    }
  },

  async getProductById({ commit }, id) {
    try {
      commit(PRODUCTS_LOADING, true);
      const product = await firestore.collection('products').doc(id).get();
      commit(PRODUCTS_LOADING, false);

      if(product.exists) {
        return product.data();
      } else {
        return null;
      }
    }
    catch(error) {
      commit(PRODUCTS_LOADING, false);
      throw error;
    }
  },

  async uploadProductImageAndGetSrc({ state, commit }, data) {
    let storageRef = storage.ref();
    const curImageName = data.curImageName;

    if(data.file) {
      if(curImageName) {
        try {
          await storageRef.child(`${path_products}/${data.curImageName}`).delete();
        } catch(error) {}
      }

      await storageRef.child(`${path_products}/${data.file.name}`).put(data.file);
      storageRef = storageRef.child(`${path_products}/${data.file.name}`);
    }
    else if(data.curImageName) {
      storageRef = storageRef.child(`${path_products}/${data.curImageName}`);
    }

    const imageSrc = await storageRef.getDownloadURL();
    return imageSrc;
  },

  async createProduct({ commit, rootState, dispatch }, formData) {
    try {
      commit(PRODUCTS_LOADING, true);
      let imageSrc;

      if(formData.file) {
        imageSrc = await dispatch('uploadProductImageAndGetSrc', {
          file: formData.file,
          curImageName: formData.data.imageName
        });

        formData.data.imageSrc = imageSrc;
        formData.data.imageName = formData.file.name;
      }

      await firestore.collection('products').doc().set({
        ...defaultProductData,
        ...formData.data,
        creator_id: rootState.users.user.uid,
        created_at: Date.now()
      });

      await dispatch('getProducts');
    }
    catch(error) {
      commit(PRODUCTS_LOADING, false);
      throw error;
    }
  },

  async updateProduct({ commit, dispatch }, formData) {
    try {
      commit(PRODUCTS_LOADING, true);

      if(formData.file) {
        const imageSrc = await dispatch('uploadProductImageAndGetSrc', {
          file: formData.file,
          curImageName: formData.data.imageName
        });

        formData.data.imageSrc = imageSrc;
        formData.data.imageName = formData.file.name;
      }

      await firestore.collection('products').doc(formData.id).update(formData.data);
      await dispatch('getProducts');
    }
    catch(error) {
      commit(PRODUCTS_LOADING, false);
      throw error;
    }
  },

  async deleteProduct({ commit, dispatch }, id) {
    try {
      await firestore.collection('products').doc(id).delete();
      await dispatch('getProducts');
    }
    catch(error) {
      throw error;
    }
  },
}

export const mutations = {
  [SET_PRODUCTS](state, products) {
    state.products = productsTransformation(products);
  },

  [CLEAR_PRODUCTS](state) {
    state.products = [];
  },

  [PRODUCTS_LOADING](state, loading) {
    state.products_loading = loading;
  }
}
