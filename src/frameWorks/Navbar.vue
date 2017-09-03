<template lang="pug">
nav#navbar.navbar.sticky-top.navbar-expand-lg.navbar-light.bg-light
  a.navbar-brand(href="#" @click.prevent="back")
    .back-btn
      span.oi.oi-chevron-left.align-middle.mr-2(v-if="showBack")
      span.align-middle {{title}}
  button.navbar-toggler(
    type="button" 
    data-toggle="collapse"
    data-target="#navbarNav"
  )
    span.navbar-toggler-icon
  div#navbarNav.collapse.navbar-collapse
    ul.navbar-nav.mr-auto
      router-link.nav-item(tag="li" to="/accounts" active-class="active")
        a.nav-link 账户信息
      router-link.nav-item(tag="li" to="/configs" active-class="active")
        a.nav-link 系统设置
</template>
<script>
import {isNil, isString} from 'lodash'
import router from '../routes'

function isNotNil(val){
  return !isNil(val)
}

export default {
  computed: {
    showBack() {
      if(isNotNil(this.$route) && isString(this.$route.path))
        return this.$route.path.split('/').length > 2
      else 
        return false
    },
    title() {
      const titles = {
        'accounts': 'Password',
        'newAccount': '新建账户信息',
        'accountDetail': '账户信息'
      }
      return titles[this.$route.name] || 'Password'
    }
  },
  methods:{
    back(){
      if(this.showBack) router.go(-1)
      else router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
.back-btn{
  position: relative;
  bottom: 0.15rem;

  span.oi{
    font-size: 75%;
  }
}
</style>
