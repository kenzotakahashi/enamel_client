import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: localStorage.getItem('user-id'),
    activeWidget: null,
  },
  mutations: {
    changeActiveWidget(state, key) {
      state.activeWidget = key
    }
  },
  actions: {
    changeActiveWidget({state, commit}, key) {
      commit('changeActiveWidget', key)
    }
  }
})
