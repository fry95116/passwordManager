<template>
  <div id="mainPanel" class="horizontalSwitcher pure-g"
        :style="{ left: offsetX, width: (100 * contents.length) + '%' }">
    <div class="subView pure-u" v-for="(content, index) in contents" 
        :key="index" :style="{ width: (100 / contents.length) + '%' }">
          <component :is="content">
          </component>
    </div>
  </div>
</template>

<script src="./HorizontalSwitcher.js"></script>

<style lang="scss" scoped>
  .horizontalSwitcher {
    overflow: hidden;
    position: relative;
    height: 100%;
    transition: left 0.3s ease-out;

    >.subView{
      height: 100%;
      display: inline-block;
    }
  }
</style>
