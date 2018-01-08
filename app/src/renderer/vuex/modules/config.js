import noScroll from 'no-scroll'

export default ({ commit }) => {
  const state = {
    activeMenu: '',
    desktop: false,
    devMode: process.env.PREVIEW !== undefined ? JSON.parse(process.env.PREVIEW) : process.env.NODE_ENV === 'development',
    // TODO: change to atom
    bondingDenom: 'fermion',
    modals: {
      help: {
        active: false
      },
      session: {
        active: false,
        state: 'welcome'
      },
      blockchain: {
        active: false
      }
    }
  }
  const mutations = {
    setDevMode (state, value) {
      state.devMode = value
    },
    setModalHelp (state, value) {
      state.modals.help.active = value
    },
    setModalSession (state, value) {
      // reset modal session state if we're closing the modal
      if (value) {
        noScroll.on()
      } else {
        state.modals.session.state = 'welcome'
        noScroll.off()
      }
      state.modals.session.active = value
    },
    setModalSessionState (state, value) {
      state.modals.session.state = value
    },
    setModalBlockchain (state, value) {
      state.modals.blockchain.active = value
    },
    setActiveMenu (state, value) {
      state.activeMenu = value
    },
    setConfigDesktop (state, value) {
      state.desktop = value
    }
  }
  return { state, mutations }
}
