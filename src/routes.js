import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Accounts from './frameworks/Accounts.vue'
import Account_Default from './frameworks/Accounts/Default.vue'
import Account_New from './frameworks/Accounts/New.vue'
import Account_Detail from './frameworks/Accounts/Detail.vue'

import Configs from './frameworks/Configs.vue'
import store from './store/index'

export default new VueRouter({
  routes: [
    { 
      path: '/',
      redirect: '/accounts'
    },
    {
      path: '/accounts',
      component: Accounts,

      children:[
        {
          name: 'accounts',
          path:'',
          component: Account_Default
        },
        {
          name: 'newAccount',          
          path:'newAccount',
          component: Account_New
        },
        {
          name: 'accountDetail',                    
          path:':name',
          component: Account_Detail,
          beforeEnter: (to, from, next) => {
            let exist = _.findIndex(store.state.accounts.data, el => el.name === to.params.name)
            if(exist === -1){
              Vue.toast(`"${to.params.name}" 不存在`, {className: 'et-custom'})
              next('/accounts')
            }
            else next()
          }
        },
      ]
    },
    { path: '/configs', component: Configs }
  ]
})