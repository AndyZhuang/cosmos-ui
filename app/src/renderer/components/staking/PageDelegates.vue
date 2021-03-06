<template lang="pug">
page#page-delegates(title='Delegates')
  div(slot="menu"): tool-bar
    a(@click='setSearch(true)')
      i.material-icons search
      .label Search
    a(@click='updateDelegates(address)')
      i.material-icons refresh
      .label Refresh

  modal-search(type="delegates")

  .delegates-container
    data-loading(v-if="delegates.loading")
    data-empty(v-else-if="delegates.delegates.length === 0")
    data-empty-search(v-else-if="filteredDelegates.length === 0")
    template(v-else)
      panel-sort(:sort='sort')
      li-delegate(v-for='i in filteredDelegates' :key='i.id' :delegate='i')

  .fixed-button-bar
    template(v-if="userCanDelegate")
      .label #[strong {{ shoppingCart.length }}] delegates selected
      btn(type="link" to="/staking/bond" :disabled="shoppingCart.length < 1" icon="chevron_right" icon-pos="right" value="Next" color="primary")
    template(v-else)
      .label You do not have any ATOMs to delegate.
      btn(disabled icon="chevron_right" icon-pos="right" value="Next" color="primary")
</template>

<script>
import { mapGetters } from 'vuex'
import { includes, orderBy } from 'lodash'
import Mousetrap from 'mousetrap'
import LiDelegate from 'staking/LiDelegate'
import Btn from '@nylira/vue-button'
import DataEmpty from 'common/NiDataEmpty'
import DataEmptySearch from 'common/NiDataEmptySearch'
import DataLoading from 'common/NiDataLoading'
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
    Btn,
    DataEmpty,
    DataEmptySearch,
    DataLoading,
    Field,
    ModalSearch,
    Page,
    Part,
    PanelSort,
    ToolBar
  },
  computed: {
    ...mapGetters(['delegates', 'filters', 'shoppingCart', 'config', 'user']),
    address () { return this.user.address },
    filteredDelegates () {
      let query = this.filters.delegates.search.query
      let list = orderBy(this.delegates.delegates, [this.sort.property], [this.sort.order])
      if (this.filters.delegates.search.visible) {
        return list.filter(i => includes(JSON.stringify(i).toLowerCase(), query.toLowerCase()))
      } else {
        return list
      }
    },
    userCanDelegate () { return this.user.atoms > 0 }
  },
  data: () => ({
    query: '',
    sort: {
      property: 'shares',
      order: 'desc',
      properties: [
        { title: 'Name', value: 'description.moniker', class: 'name' },
        { title: 'Vote %', value: 'shares', class: 'percent_of_vote' },
        { title: 'Votes', value: 'voting_power', class: 'number_of_votes' },
        { title: 'Your Votes', value: 'bonded', class: 'bonded_by_you' },
        { title: '', value: '', class: 'action' }
      ]
    }
  }),
  watch: {
    address: function (address) {
      address && this.updateDelegates(address)
    }
  },
  methods: {
    async updateDelegates (address) {
      let candidates = await this.$store.dispatch('getDelegates')
      this.$store.dispatch('getBondedDelegates', {candidates, address})
    },
    setSearch (bool) { this.$store.commit('setSearchVisible', ['delegates', bool]) }
  },
  mounted () {
    Mousetrap.bind(['command+f', 'ctrl+f'], () => this.setSearch(true))
    Mousetrap.bind('esc', () => this.setSearch(false))
    this.updateDelegates(this.user.address)
  }
}
</script>
<style lang="stylus">
@require '~variables'

.delegates-container
  padding-bottom 6rem

.fixed-button-bar
  padding 0.5rem 1rem
  background alpha(app-bg, 90%)
  display flex
  justify-content space-between
  position fixed
  bottom 3rem + px
  left 0
  right 0
  z-index z(toolBar)
  .label
    color bright
    line-height 2rem
    strong
      font-weight bold

@media screen and (min-width: 768px)
  .delegates-container
    padding-bottom 7rem

  .fixed-button-bar
    padding 1rem

@media screen and (min-width: 1024px)
  .fixed-button-bar
    margin-left width-side
</style>
