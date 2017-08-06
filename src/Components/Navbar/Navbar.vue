<template>
  <nav id="navbar"> 
    <div class="pure-g">
      <div class="meun-btn pure-u" style="width: 15%">
          <i class="navbar-icon material-icons">menu</i>
      </div>
      <div class="pure-u" style="width: 70%">
        <div class="navbar-title">Password</div>
      </div>
      <div class="meun-btn pure-u" style="width: 15%">
        <i class="navbar-icon material-icons">search</i>
      </div>
    </div>
    <ul v-if="showTab" class="tab pure-g">
      <li class="tab-item pure-u" v-for="(title, index) in titles"
          :key="index"
          :class="{ active: index === currentItemIndex }"
          :style="{ width: 100 / titles.length + '%' }"
          @mousedown="waving" @touchstart="waving"
          @click="switchTab">
        <a>{{ title }}</a>
        <!-- 波纹效果 START -->
        <div class="dot-container">
          <div class="dot"></div>
        </div>
        <!--  波纹效果 END  -->
      </li>
      <li class="indicator pure-u"
          :style="{ left: indicatorPos, width: 100 / titles.length + '%' }">
      </li>
    </ul>
  </nav>
</template>
<script src="./navbar.js">
</script>
<style lang="scss" scoped>
  @import "../../base";

  #navbar{
    $font-size: 20px;
    $line-height: 2.8em;
    
    position: relative;
    width: 100%;
    z-index: 3;
    background-color: $primary_color;
    text-align: center;
    font-size: $font-size;
    @include shadow(1);
    
    .navbar-title{
      line-height: $line-height;
      font: {
        size: $font-size;
        weight: normal;
      }
      color: $primary-color-text;
    }

    .navbar-icon{
      width: 100%;
      height: 100%;
      line-height: $line-height;
      font-size: $font-size;
      color: $primary-color-text;
      opacity: 0.6;
      transition: {
        property: opacity, background-color;
        duration: 0.3s;
        timing-function: ease-in;
      }
      &:active{
        opacity: 1.0;
        background-color: $primary-color-dark;
      }
    }
    
    .tab{
      padding-left: 0px;
      margin: {
        top: 0px;
        bottom: 0px;
      }
      list-style: none;

      $line-height: 3.4em;
      $indicator-height: 0.13em;
      // $indicator-color: #18FFFF;
      $indicator-color: #fff;
      $duration: 0.25s;


      .tab-item {
        line-height: $line-height;
        font: {
          size: 14px;
          weight: lighter;
        }
        color: $primary-color-text;
        display: inline-block;
        position: relative;
        overflow: hidden;

        >a {
          display: block;
          width: 100%;
          outline: none;
          -webkit-tap-highlight-color:transparent !important;
          height: $line-height - $indicator-height;
          text-decoration: none;
          color: $primary-color-text;
          opacity: 0.6;
          position: relative;
          transition: {
            property: opacity;
            duration: $duration;
            timing-function: ease-in;
            delay: 0ms;
          }
        }

        &.active>a {
          opacity: 1.0;
        }

        >.dot-container {
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.0);
          z-index: 0;
          overflow: hidden;
          transition: {
            property: background-color;
            duration: 0.2s;
            timing-function: ease-out;
          }

          >.dot {
            position: absolute;
            border-radius: 50%;
            background-color: #fff;
            transform: scale(0.0);
            &.active {
              animation: {
                name: wave;
                duration: 0.4s;
                timing-function: linear;
                fill-mode: both;
              }
            }
          }
        }
      }
      
      >.indicator{
        position: relative;
        left: 0px;
        height: $indicator-height;
        background-color: $indicator-color;
        transition: {
          property: left;
          duration: $duration;
          timing-function: ease-out;
          delay: 0ms;
        }
      } 
    }

    @keyframes wave{
      0%   {opacity: 0.0; transform: scale(0.0);}
      50%  {opacity: 0.3; transform: scale(0.5);}
      100% {opacity: 0.0; transform: scale(1.0);}
    }
  }
</style>
