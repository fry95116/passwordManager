// pages/settings/settings.js
import { push, clearAll } from '../../models/storage'

Page({

  /** 页面的初始数据 */
  data: {
    duration: 30,
    durations: [15, 30, 45, 60]
  },

  // durationTyping(e){
  //   if (!/^\d+$/.test(e.detail.value)) return 
  //   let d = parseInt(e.detail.value)

  //   this.setData({ duration: e.detail.value })

  // },

  durationChanging(e){
    this.setData({ duration: this.data.durations[e.detail.value] })
  },
  
  toExport(){
    wx.navigateTo({
      url: './export/export',
    })
  },

  toImport() {
    wx.navigateTo({
      url: './import/import',
    })
  },

  clearCache(){
    wx.showModal({
      title: '确认清除',
      content: '确定清除所有信息？未备份的信息将无法恢复！',
      confirmText: "确认",
      cancelText: "取消",
      success: (res)=>{
        if (res.confirm) {
          clearAll()
          wx.reLaunch({url: '/pages/welcome/welcome'})
        }
      }
    })
  },

  // 生命周期函数--监听页面显示
  onShow() {
    let settings = getApp().settings
    this.setData({duration: settings.duration})
  },

  // 生命周期函数--监听页面隐藏
  onHide() {
    getApp().settings.duration = this.data.duration
    push()
  },
})