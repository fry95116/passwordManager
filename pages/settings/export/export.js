// pages/settings/export/export.js
import { exportBase64 } from '../../../models/storage'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: ''
  },

  // 生命周期函数--监听页面显示
  onShow() {
    this.setData({ result: exportBase64() })
  },

  copyToClipboard(){
    wx.setClipboardData({
      data: this.data.result,
      success(res){
        wx.showToast({title: '复制成功'})
      }
    })
  }
})

function base64ToInt(char) {
  let charCode = char.charCodeAt(0)
  if (charCode >= 48 && charCode <= 57) return charCode - 48 + 52
  else if (charCode >= 65 && charCode <= 90) return charCode - 65
  else if (charCode >= 97 && charCode <= 122) return charCode - 97 + 26
  else if (char === '+') return 62
  else if (char === '/') return 63
  else return -1
}

function intToHex(i) {
  const dict = '0123456789ABCDEF'
  return dict[Math.floor(i / 16)] + dict[i % 16]
}

