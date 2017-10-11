import './base.scss'
import 'bootstrap'

import _ from 'lodash'

import Vue from 'vue'
import Vuex from 'vuex'
import Validator from './Addons/Validator'
import Toast from 'vue-easy-toast'
import VueClipboard from 'vue-clipboard2'
Vue.use(Validator)
Vue.use(Toast, {
  mode: 'queue',
  duration: 3000,
  horizontalPosition: 'center',
  verticalPosition: '6em'
})
Vue.use(VueClipboard)

import App from './App.vue'

$(document).ready(()=>{
  $('[data-toggle="tooltip"]').tooltip()

  // if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices){
  //   navigator.mediaDevices.enumerateDevices()
  //   .then(function(devices) {
  //     devices.forEach(function(device) {
  //       alert(device.kind + ": " + device.label +
  //                   " id = " + device.deviceId);
  //     });
  //   })
  // }else{
  //   alert('navigator.mediaDecvices:' + typeof(navigator.mediaDecvices))
  //   alert('navigator.mediaDevices.enumerateDevices' + typeof(navigator.mediaDevices.enumerateDevices))
  // }
  
  // let support1 = typeof MediaDevices.getUserMedia
  // let support2 = typeof navigator.getUserMedia

  // // Set the name of the hidden property and the change event for visibility
  // let hidden, visibilityChange;
  // if (!_.isUndefined(document.hidden)) { // Opera 12.10 and Firefox 18 and later support 
  //   hidden = "hidden";
  //   visibilityChange = "visibilitychange";
  // } 
  // else if (!_.isUndefined(document.msHidden)) {
  //   hidden = "msHidden";
  //   visibilityChange = "msvisibilitychange";
  // } 
  // else if (!_.isUndefined(document.webkitHidden)) {
  //   hidden = "webkitHidden";
  //   visibilityChange = "webkitvisibilitychange";
  // }

  // // Warn if the browser doesn't support addEventListener or the Page Visibility API
  // if (_.isUndefined(document.addEventListener) || _.isUndefined(document[hidden])) {
  //   console.warn("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
  // } 
  // else {
  //   // Handle page visibility change
  //   document.addEventListener(visibilityChange, ()=>{
  //     let isHidden = document[hidden]
  //     let state = document.visibilityState
  //     let now = new Date().toLocaleString()
  //     $('#vpaTest').append($(`<div>${now} isHidden=${isHidden},state=${state}</div>`))
  //   }, false);
  // }
  // //
  // window.addEventListener('pagehide', function(e) {
  //   setTimeout(function() {
  //     $('#vpaTest').empty()
  //   })
  // })

  new Vue({
    el: '#app',
    render: h => h(App)
  })
})