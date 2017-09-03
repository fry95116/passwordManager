import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import accounts from './accounts'
import configs from './configs'
import randomPasswordGenerator from './randomPasswordGenerator'
import keygen from './keygen'

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {accounts, configs, keygen, randomPasswordGenerator}
})