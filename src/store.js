import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: localStorage.getItem('user-id'),
    activeWidget: null,
    openState: {}
  },
  mutations: {
    changeActiveWidget(state, key) {
      state.activeWidget = state.activeWidget === key ? null : key
    },
    changeOpenState(state, {id, val}) {
      const open = state.openState[id]
      state.openState[id] = val || (open === undefined ? true : !open)
      console.log(state.openState)
    }
  },
  actions: {
    changeActiveWidget({state, commit}, key) {
      commit('changeActiveWidget', key)
    }
  }
})
