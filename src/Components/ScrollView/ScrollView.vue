<template>
  <div class="scorllView">
    <slot>
      no content
    </slot>
  </div>  
</template>
<script>
  export default {
    
  }
</script>
<style lang="scss" scoped>
  .scrollView {
    overflow: auto;
    width: 100%;
    height: 100%;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;

    ::-webkit-scrollbar{
      width: 0px;
    }
  }
</style>
