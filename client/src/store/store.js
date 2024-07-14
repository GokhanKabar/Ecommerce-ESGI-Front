import { createApp } from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const app = createApp({});
app.use(Vuex);

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    cart: [],
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.isUserLoggedIn = !!token;
    },
    setUser(state, user) {
      state.user = user;
    },
    CLEAR_CART(state) {
      state.cart= [];
    },
    ADD_PRODUCT_TO_CART(state, product) {
      const item = state.cart.find(p => p.product.id === product.id);
      if (item) {
        console.log('new quantity'+product.quantity)
        item.product.quantity+=product.quantity ;
      } else {
        console.log('new productId  '+product.id);
        state.cart.push({ product });
      }
    },
    INCREMENT_PRODUCT_QUANTITY(state, id_product) {
      const item = state.cart.find(p => p.product.id === id_product);
      if (item) {
        console.log('asked product'+id_product)
        item.product.quantity++;
      }
    },
    DECREMENT_PRODUCT_QUANTITY(state, id_product) {
      const item = state.cart.find(p => p.product.id === id_product);
      if (item && item.product.quantity > 0) {
        console.log('asked product'+id_product)
        item.product.quantity--;
        if(item.product.quantity==0){
          state.cart = state.cart.filter(p => p.product.id !== id_product);
        }
      }
      if (item && item.product.quantity == 0) {
        state.cart = state.cart.filter(p => p.product.id !== id_product);
      }
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('setToken', token);
    },
    clearCart({ commit }) {
      commit('CLEAR_CART');
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
