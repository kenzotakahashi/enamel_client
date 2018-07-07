import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeDropdown: null
  },
  mutations: {
    changeActiveDropdown(state, key) {
      state.activeDropdown = key
    }
  },
  actions: {
    changeActiveDropdown({state, commit}, key) {
      commit('changeActiveDropdown', key)
    }
  }
})
