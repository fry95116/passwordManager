import { fromBase64 } from "../../../models/storage";

// pages/welcome/import/import.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    init: false,
    source: ''
  },

  onLoad(option){
    this.setData({init: option.init})
  },

  onSourceInput(e){
    this.setData({source: e.detail.value})
  },

  copyToClipboard(){
    wx.getClipboardData({
      success(res){
        wx.showToast({ title: '复制成功' })
        this.setData({ source: res.data })
      }
    })
  },

  onImport(){
    try{
      fromBase64(this.data.source)
      wx.showToast({ title: '添加成功' })      
      if(this.data.init === 'true') wx.switchTab({url: '/pages/pwList/pwList'})
      else wx.navigateBack()
      
    }
    catch(e){
      console.log(e)
      wx.showToast({ title: '导入失败', image: '/res/alert.png' })
      if(this.data.init !== 'true') wx.navigateBack()
    }
  }
})