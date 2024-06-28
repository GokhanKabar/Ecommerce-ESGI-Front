import { createApp } from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const app = createApp({});
app.use(Vuex);

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    cart: {
      products: JSON.parse(localStorage.getItem('cart'))?.products || []
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.isUserLoggedIn = !!token;
    },
    setUser(state, user) {
      state.user = user;
    },
    ADD_PRODUCT_TO_CART(state, product) {
      const item = state.cart.products.find(p => p.id === product.id);
      if (item) {
        item.quantity++;
      } else {
        state.cart.products.push({ ...product, quantity: 1 });
      }
      saveCartToLocalStorage(state.cart);
    },
    INCREMENT_PRODUCT_QUANTITY(state, product) {
      const item = state.cart.products.find(p => p.id === product.id);
      if (item) {
        item.quantity++;
        saveCartToLocalStorage(state.cart);
      }
    },
    DECREMENT_PRODUCT_QUANTITY(state, product) {
      const item = state.cart.products.find(p => p.id === product.id);
      if (item && item.quantity > 0) {
        item.quantity--;
        saveCartToLocalStorage(state.cart);
      }
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('setToken', token);
    },
    setUser({ commit }, user) {
      commit('setUser', user);
    },
    addProductToCart({ commit }, product) {
      commit('ADD_PRODUCT_TO_CART', product);
    },
    incrementProductQuantity({ commit }, product) {
      commit('INCREMENT_PRODUCT_QUANTITY', product);
    },
    decrementProductQuantity({ commit }, product) {
      commit('DECREMENT_PRODUCT_QUANTITY', product);
    }
  }
});
