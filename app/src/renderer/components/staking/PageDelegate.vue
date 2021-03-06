<template lang="pug">
page(icon="storage" title="Delegate")
  div(slot="menu"): tool-bar
    a(v-if='inCart' @click.native='rm(delegate.id)')
      i.material-icons delete
      .label Remove
    a(v-else-if="config.devMode" @click.native='add(delegate)')
      i.material-icons add
      .label Add

  h3 {{ delegate.description.moniker }}
  part(title="Delegate Details")
    list-item(dt='Public Key' :dd='delegate.id')
    list-item(dt='Country' :dd='country')
    list-item(dt='Start Date' :dd='delegate.startDate || "n/a"')
  part(title="Delegate Description")
    text-block( :content="delegate.description.details")
  part(title="Delegate Stake" v-if="config.devMode")
    list-item(dt='Voting Power' :dd='delegate.voting_power + " ATOM"')
    list-item(dt='Bonded Atoms' :dd='delegate.shares + " ATOM"')
    list-item(dt='Commission'
      :dd='(delegate.commission * 100).toFixed(2) + "%"')
    list-item(dt='Max Commission'
      :dd='(delegate.commissionMax * 100).toFixed(2) + "%"')
    list-item(dt='Max Commission Increase'
      :dd='(delegate.commissionMaxRate * 100).toFixed(2) + "%"')

  part(title="External" v-if="delegate.description.website")
    list-item(dt="Website" :dd="delegate.description.website" :href="delegate.description.website")
</template>

<script>
import { mapGetters } from 'vuex'
import countries from 'scripts/countries.json'
import Btn from '@nylira/vue-button'
import ListItem from 'common/NiListItem'
import Page from 'common/NiPage'
import Part from 'common/NiPart'
import TextBlock from 'common/TextBlock'
import ToolBar from 'common/NiToolBar'
export default {
  name: 'page-delegate',
  components: {
    Btn,
    ListItem,
    Page,
    Part,
    TextBlock,
    ToolBar
  },
  computed: {
    ...mapGetters(['delegates', 'shoppingCart', 'user', 'config']),
    delegate () {
      let value = {
        description: {}
      }
      if (this.delegates.delegates && this.$route.params.delegate) {
        value = this.delegates.delegates.find(v => v.id === this.$route.params.delegate) || value
      }
      return value
    },
    inCart () {
      return this.shoppingCart.find(c => c.id === this.delegate.id) !== undefined
    },
    country () {
      return this.delegate.country ? this.countryName(this.delegate.country) : 'n/a'
    }
  },
  methods: {
    countryName (code) {
      let country = countries.find(c => c.value === code)
      return country ? country.key : code
    },
    add (delegate) {
      this.$store.commit('addToCart', delegate)
    },
    rm (delegateId) {
      this.$store.commit('removeFromCart', delegateId)
    }
  },
  mounted () {
    if (!this.delegate.id) { this.$router.push('/staking') }
  }
}
</script>
<style lang="stylus">
@require '~variables'
</style>
