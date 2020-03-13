import ordersTransformation from '@/data_transformation/orders'
import { firestore } from '@/services/firebase';

import {
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  CHANGE_COUNTER,
  SET_ORDERS,
  CART_LOADING,
  CLEAR_CART,
  CLEAR_ORDERS,
} from '@/utils/mutations-types';

export const state = () => ({
   cart: [],
   cart_loading: false,
   orders: [],
});

export const getters = {
  cartCounter: state => state.cart.length,
  totalPrice: state => state.cart.reduce((sum, product) => {
    return sum + (product.quantity * product.price);
  }, 0),
}

export const actions = {
  addProduct({ commit, state, dispatch }, product) {
    let hasProduct = state.cart.find(cartProduct => {
      return cartProduct.id === product.id;
    });

    if(hasProduct) {
      hasProduct = JSON.parse(JSON.stringify(hasProduct));
      dispatch('changeCounterProduct', {
        id: hasProduct.id,
        quantity: ++hasProduct.quantity
      })
    } else {
      commit(ADD_PRODUCT, product);
    }
  },

  removeProduct({ commit }, id) {
    commit(REMOVE_PRODUCT, id);
  },

  changeCounterProduct({ commit }, data) {
    commit(CHANGE_COUNTER, data);
  },

  async checkoutOrder({ commit, state }, formData) {
    try {
      commit(CART_LOADING, true);

      const order = {
        ...formData,
        date: Date.now(),
        products: [...state.cart]
      }

      await firestore.collection('history_orders').doc().set(order);

      commit(CLEAR_CART);
      commit(CART_LOADING, false);
    }
    catch(error) {
      commit(CART_LOADING, false);
      throw error;
    }
  },

  async getUsersOrders({ commit, state, rootState }) {
    try {
      commit(CART_LOADING, true);

      const user_id = rootState.users.user.uid;
      const orders = await firestore.collection('history_orders').where("user_id", "==", user_id).get();

      commit(SET_ORDERS, orders.docs);
      commit(CART_LOADING, false);
    }
    catch(error) {
      commit(CART_LOADING, false);
      throw error;
    }
  }
}

export const mutations = {
  [ADD_PRODUCT](state, product) {
    state.cart.push({
      ...product,
      quantity: 1
    })
  },

  [REMOVE_PRODUCT](state, id) {
    state.cart = state.cart.filter(product => product.id !== id);
  },

  [CHANGE_COUNTER](state, data) {
    state.cart.forEach(product => {
      if(product.id === data.id && data.quantity > 0) {
        product.quantity = data.quantity;
      }
      return;
    });
  },

  [SET_ORDERS](state, orders) {
    state.orders = ordersTransformation(orders);
  },

  [CART_LOADING](state, loading) {
    state.cart_loading = loading;
  },

  [CLEAR_CART](state) {
    state.cart = [];
  },

  [CLEAR_ORDERS](state) {
    state.orders = [];
  },

}
