<template>
  <div id="app">
    <navbar :titles="titles" 
      :currentItemIndex="currentFunctionIndex"
      @tabChange="changeFunction">
    </navbar>

    <horizontalSwitcher :contents="contents" 
      :currentViewIndex="currentFunctionIndex">
    </horizontalSwitcher>
  </div>
</template>
<script>
  import navbar from './Components/Navbar/Navbar.vue'
  import horizontalSwitcher from './Components/HorizontalSwitcher/HorizontalSwitcher.vue'
  import accounts from './Components/Accounts/Accounts.vue'
  import keygens from './Components/Keygens/Keygens.vue'
  import randomPasswordGenerator from './Components/RandomPasswordGenerator/RandomPasswordGenerator.vue'

  export default {
    name: 'app',
    data () {
      return {
        functions: [
          {
            title: '账户信息',
            content: accounts
          },{
            title: '秘钥管理',
            content: keygens
          },{
            title: '密码生成',
            content: randomPasswordGenerator
          }
        ], //功能列表
        currentFunctionIndex: 0 //当前显示的功能
      }
    },
    computed:{
      titles: function(){
        return this.functions.map((el)=>el.title)
      },
      contents: function(){
        return this.functions.map((el)=>el.content)
      }
    },
    methods:{
      changeFunction:function(val){
        this.currentFunctionIndex = val
      }
    },
    
    components:{
      'navbar': navbar,
      'horizontalSwitcher': horizontalSwitcher
    }
  }
</script>

<style lang="scss">

@import "base";

#app {
  font-family: Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
