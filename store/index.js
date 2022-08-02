export const state = () => ({
  authUser: null,
})

export const mutations = {
  SET_USER(state, user) {
    state.authUser = user
  },
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.user) {
      commit('SET_USER', req.user)
    }
  },
  async logout({ commit }) {
    await this.$axios.post('/logout')
    commit('SET_USER', null)
  },
}
