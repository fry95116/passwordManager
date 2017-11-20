// pages/welcome/welcome.js

import {pull} from '../../models/storage'
import { isNotNil } from '../../utils/util';
import { Infos } from '../../models/Infos';
import { Settings } from '../../models/Settings'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFirstLoading: false
  },
  toNewChiper(){
    wx.redirectTo({url: '/pages/settings/newChiper/newChiper?init=true'})
  },
  toImport(){
    wx.redirectTo({url: '/pages/settings/import/import?init=true'})
  },
  onLoad: function (options) {
    pull().then(()=>wx.switchTab({url:'/pages/pwList/pwList'}))
    .catch((e)=>{
      console.error(e)
      // initlize
      let APP = getApp()
      APP.infos = new Infos()
      APP.settings = new Settings()
      this.setData({isFirstLoading: true})
    })
  },
})