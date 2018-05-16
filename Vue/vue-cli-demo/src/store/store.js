import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userName : 1
  },
  mutations: {
    increment (state) {
       state.userName ++
      }
  },
  actions:{
    increment (state) {
        context.commit('increment')
      }
  }
})

export default store