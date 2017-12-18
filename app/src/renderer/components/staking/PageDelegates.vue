<template lang="pug">
page(:title='pageTitle')
  div(slot="menu"): tool-bar
    a(@click='setSearch(true)')
      i.material-icons search
      .label Search
    router-link(to='/staking/bond')
      i.material-icons check_circle
      .label Bond Atoms
  modal-search(v-if="filters.delegates.search.visible" type="delegates")
  template(v-if="filteredDelegates.length > 0")
    panel-sort(:sort='sort')
    li-delegate(
      v-for='i in filteredDelegates'
      key='i.id'
      :delegate='i')
  data-error(v-else)
</template>

<script>
import { mapGetters } from 'vuex'
import { includes, orderBy } from 'lodash'
import Mousetrap from 'mousetrap'
import LiDelegate from 'staking/LiDelegate'
import DataError from 'common/NiDataError'
import Field from '@nylira/vue-field'
import ModalSearch from 'common/NiModalSearch'
import Page from 'common/NiPage'
import Part from 'common/NiPart'
import PanelSort from 'staking/PanelSort'
import ToolBar from 'common/NiToolBar'
export default {
  name: 'page-delegates',
  components: {
    LiDelegate,
    DataError,
    Field,
    ModalSearch,
    Page,
    Part,
    PanelSort,
    ToolBar
  },
  computed: {
    ...mapGetters(['delegates', 'filters', 'shoppingCart']),
    pageTitle () {
      if (this.shoppingCart.length > 0) {
        return `Delegates (${this.shoppingCart.length} Selected)`
      } else {
        return 'Delegates'
      }
    },
    filteredDelegates () {
      let query = this.filters.delegates.search.query
      let list = orderBy(this.delegates, [this.sort.property], [this.sort.order])
      if (this.filters.delegates.search.visible) {
        return list.filter(i => includes(i.keybaseID.toLowerCase(), query.toLowerCase()))
      } else {
        return list
      }
    }
  },
  data: () => ({
    query: '',
    sort: {
      property: 'keybaseID',
      order: 'asc',
      properties: [
        { id: 1, title: 'Keybase ID', value: 'keybaseID', initial: true },
        { id: 2, title: 'Country', value: 'country' },
        { id: 3, title: 'Voting Power', value: 'voting_power' },
        { id: 4, title: 'Delegated Power', value: 'shares' },
        { id: 5, title: 'Commission', value: 'commission' }
      ]
    }
  }),
  methods: {
    setSearch (bool) { this.$store.commit('setSearchVisible', ['delegates', bool]) }
  },
  mounted () {
    Mousetrap.bind(['command+f', 'ctrl+f'], () => this.setSearch(true))
    Mousetrap.bind('esc', () => this.setSearch(false))
  }
}
</script>