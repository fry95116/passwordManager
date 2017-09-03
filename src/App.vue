<template lang="pug">
div
  navbar
  #vpaTest 12345
  div.main-panel
    router-view

</template>
<script>
  import Vue from 'vue'

  import store from './store/index'
  import Navbar from './frameworks/Navbar.vue'
  import router from './routes'

  export default {
    name: 'app',
    router,
    store,
    components: {
      navbar: Navbar
    }
  }
</script>
<style lang="scss">

$panelWidth: 680px;

@media screen and (min-width: $panelWidth)  {
  #navbar{
    margin-bottom: 1em;
  }
}
.main-panel{
  margin-left: auto;
  margin-right: auto;
  max-width: $panelWidth;
  overflow-x: hidden;
}
</style>
