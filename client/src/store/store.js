import { createApp } from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const app = createApp({})
app.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    cart: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      state.isUserLoggedIn = !!token
    },
    setUser(state, user) {
      state.user = user
    },
    CLEAR_CART(state) {
      state.cart = []
    },
    ADD_PRODUCT_TO_CART(state, product) {
      if (product.stock < product.quantity) {
        return alert('Stock insuffisant')
      }
      if (!Array.isArray(state.cart)) {
        state.cart = []
      }
      const item = state.cart.find((p) => p.product.id === product.id)
      if (item) {
        item.product.quantity += product.quantity
      } else {
        state.cart.push({ product: { ...product, quantity: product.quantity } })
      }
    },
    INCREMENT_PRODUCT_QUANTITY(state, id_product) {
      if (!Array.isArray(state.cart)) {
        state.cart = []
      }
      const item = state.cart.find((p) => p.product.id === id_product)
      if (item && item.product.stock >= item.product.quantity + 1) {
        item.product.quantity++
      } else {
        alert('Stock insuffisant')
      }
    },
    DECREMENT_PRODUCT_QUANTITY(state, id_product) {
      if (!Array.isArray(state.cart)) {
        state.cart = []
      }
      const item = state.cart.find((p) => p.product.id === id_product)
      if (item && item.product.quantity > 0) {
        item.product.quantity--
        if (item.product.quantity == 0) {
          state.cart = state.cart.filter((p) => p.product.id !== id_product)
        }
      }
    },RESET_USER(state) {
      state.token = null;
      state.user = null;
      state.isUserLoggedIn = false;
      state.cart = []; 
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('setToken', token)
    },
    clearCart({ commit }) {
      commit('CLEAR_CART')
    },
    setUser({ commit }, user) {
      commit('setUser', user)
    },
    addProductToCart({ commit }, product) {
      commit('ADD_PRODUCT_TO_CART', product)
    },
    incrementProductQuantity({ commit }, productId) {
      commit('INCREMENT_PRODUCT_QUANTITY', productId)
    },
    decrementProductQuantity({ commit }, productId) {
      commit('DECREMENT_PRODUCT_QUANTITY', productId)
    }
    ,resetUser({ commit }) {
      commit('RESET_USER');
    }
  }
})

export default store
