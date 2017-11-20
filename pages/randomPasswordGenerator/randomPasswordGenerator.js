// pages/randomPasswordGenerator/randomPasswordGenerator.js

import { push } from '../../models/storage'
Page({

  /** 页面的初始数据 */
  data: {
    length: 8,
    upperCase: true,
    lowerCase: true,
    num: true,
    specialSymbol: false,
    result: ''
  },

  lengthTyping(e) {
    let length = this.data.length
    if (/^\d+$/.test(e.detail.value)) length = e.detail.value

    this.setData({length})
  },

  upperCaseChange: function (e) {
    this.setData({ upperCase: e.detail.value })
    
  },

  lowerCaseChange: function (e) {
    this.setData({ lowerCase: e.detail.value })
  },

  numChange: function (e) {
    this.setData({ num: e.detail.value })
  },

  specialSymbolChange: function (e) {
    this.setData({ specialSymbol: e.detail.value })
  },

  generateRandomPassword(e) {
    const CHARSETS = {
      upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowerCase: 'abcdefghijklmnopqrstuvwxyz',
      num: '0123456789',
      specialSymbol: '!@#$%^&*'
    }
    let charset = ''
    let length_pwd = this.data.length
    for (let k in CHARSETS) {
      if (this.data[k] === true) charset += CHARSETS[k]
    }
    let result = ''
    let range = charset.length
    for (let i = 0; i < length_pwd; ++i) {
      result += charset[Math.floor(Math.random() * range)]
    }
    this.setData({ result })
  },

  clipPassword(e) {
    if (this.data.result !== '')
      wx.setClipboardData({
        data: this.data.result,
        success() {
          wx.showToast({
            title: '复制到剪贴板',
            duration: 2000
          })
        },
        fail() {
          wx.showToast({
            title: '扫码失败',
            image: '/res/alert.png',
            duration: 2000
          })
        }
      })
  },
  onLoad(){
    let { length, upperCase, lowerCase, num, specialSymbol} = getApp().settings.rpga
    this.setData({ length, upperCase, lowerCase, num, specialSymbol })
  },

  // 生命周期函数--监听页面加载
  onShow() {
    // let { length, upperCase, lowerCase, num, specialSymbol} = getApp().settings.rpga
    // this.setData({ length, upperCase, lowerCase, num, specialSymbol })
  },

  // 生命周期函数--监听页面隐藏
  onHide() {
    let { length, upperCase, lowerCase, num, specialSymbol} = this.data
    getApp().settings.rpga = { length, upperCase, lowerCase, num, specialSymbol }
    push('settings')
  },
})