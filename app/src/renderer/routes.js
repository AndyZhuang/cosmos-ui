function r (type, pageName) { return require(`./components/${type}/Page${pageName}`).default }

let common = r.bind(null, 'common')
let govern = r.bind(null, 'govern')
let monitor = r.bind(null, 'monitor')
let staking = r.bind(null, 'staking')
let wallet = r.bind(null, 'wallet')

export default [
  // GOVERN
  { path: '/proposals', name: 'proposals', component: govern('Proposals') },
  { path: '/proposals/new', component: govern('ProposalsNew') },
  { path: '/proposals/new/adjust', component: govern('ProposalsNewAdjust') },
  { path: '/proposals/new/amend', component: govern('ProposalsNewAmend') },
  { path: '/proposals/new/create', component: govern('ProposalsNewCreate') },
  { path: '/proposals/new/text', component: govern('ProposalsNewText') },
  { path: '/proposals/new/upgrade', component: govern('ProposalsNewUpgrade') },
  { path: '/proposals/:proposal', name: 'proposal', component: govern('Proposal') },

  // STAKE
  { path: '/staking', name: 'delegates', component: staking('Delegates') },
  { path: '/staking/bond', name: 'bond', component: staking('Bond') },
  {
    path: '/staking/delegates/:delegate',
    name: 'delegate',
    component: staking('Delegate')
  },

  // MONITOR
  { path: '/block/:block', name: 'block', component: monitor('Block') },
  { path: '/blockchain', name: 'blockchain', component: monitor('Blockchain') },
  { path: '/validators', name: 'validators', component: monitor('Validators') },
  {
    path: '/validators/:validator',
    component: monitor('Validator'),
    children: [
      {
        path: '/',
        name: 'validator-index',
        component: monitor('ValidatorIndex')
      },
      {
        path: 'power',
        name: 'validator-power',
        component: monitor('ValidatorPower')
      },
      {
        path: 'proposals',
        name: 'validator-proposals',
        component: monitor('ValidatorProposals')
      },
      {
        path: 'slashes',
        name: 'validator-slashes',
        component: monitor('ValidatorSlashes')
      },
      {
        path: 'votes',
        name: 'validator-votes',
        component: monitor('ValidatorVotes')
      }
    ]
  },

  // USER
  { path: '/profile', name: 'profile', component: common('Profile') },

  // WALLET
  { path: '/', name: 'balances', component: wallet('Balances') },
  { path: '/wallet/send', name: 'send', props: true, component: wallet('Send') },
  { path: '/wallet/transactions', name: 'transactions', component: wallet('Transactions') },

  // 404
  { path: '/404', component: common('404') },
  { path: '*', component: common('404') }
]
