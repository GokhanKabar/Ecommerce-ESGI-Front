import { createApp } from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import productService from '../services/ProductService'

const app = createApp({})
app.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    cart: [],
    reservationInterval: null
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
    async UPDATE_PRODUCT_STOCK(state, { productId, newStock, operation }) {
      try {
        await productService.updateStock(productId, newStock, operation)
      } catch (error) {
        console.error('Error updating product stock in DB:', error)
      }
    },
    async ADD_PRODUCT_TO_CART(state, product) {
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
        state.cart.push({ product: { ...product, quantity: product.quantity, reservationTime: Date.now() } })
      }
      product.stock -= product.quantity
      await this.commit('UPDATE_PRODUCT_STOCK', { productId: product.id, newStock: product.quantity, operation: 0 })
    },
    async INCREMENT_PRODUCT_QUANTITY(state, id_product) {
      if (!Array.isArray(state.cart)) {
        state.cart = []
      }
      const item = state.cart.find((p) => p.product.id === id_product)
      if (item && item.product.stock >= item.product.quantity + 1) {
        item.product.quantity++
        item.product.stock--
        await this.commit('UPDATE_PRODUCT_STOCK', { productId: item.product.id, newStock: 1, operation: 0 })
      } else {
        alert('Stock insuffisant')
      }
    },
    async DECREMENT_PRODUCT_QUANTITY(state, id_product) {
      if (!Array.isArray(state.cart)) {
        state.cart = []
      }
      const item = state.cart.find((p) => p.product.id === id_product)
      if (item && item.product.quantity > 0) {
        item.product.quantity--
        item.product.stock++
        if (item.product.quantity == 0) {
          state.cart = state.cart.filter((p) => p.product.id !== id_product)
        }
        await this.commit('UPDATE_PRODUCT_STOCK', { productId: item.product.id, newStock: 1, operation: 1 })
      }
    },
    RESET_USER(state) {
      state.token = null
      state.user = null
      state.isUserLoggedIn = false
      state.cart = []
      if (state.reservationInterval) {
        clearInterval(state.reservationInterval)
        state.reservationInterval = null
      }
    },
    async START_RESERVATION_CHECK(state) {
      if (state.reservationInterval) {
        clearInterval(state.reservationInterval)
      }
      state.reservationInterval = setInterval(async () => {
        const currentTime = Date.now()
        const productsToRestore = []
        state.cart = state.cart.filter(item => {
          const elapsedTime = (currentTime - item.product.reservationTime) / 1000 / 60 // Convert to minutes
          if (elapsedTime >= 1) {
            productsToRestore.push(item)
            return false
          }
          return true
        })
        console.log(productsToRestore)
        for (const item of productsToRestore) {
          item.product.stock += item.product.quantity // Revert stock
          await this.commit('UPDATE_PRODUCT_STOCK', { productId: item.product.id, newStock: item.product.quantity, operation: 1 })
          
        }
      }, 1000)
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
      commit('START_RESERVATION_CHECK')
      commit('ADD_PRODUCT_TO_CART', product)
    },
    incrementProductQuantity({ commit }, productId) {
      commit('INCREMENT_PRODUCT_QUANTITY', productId)
    },
    decrementProductQuantity({ commit }, productId) {
      commit('DECREMENT_PRODUCT_QUANTITY', productId)
    },
    resetUser({ commit }) {
      commit('RESET_USER')
    }
  }
})

export default store
