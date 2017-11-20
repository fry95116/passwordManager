// pages/welcome/newChiper/newChiper.js
import { QRcode } from '../../../utils/qrcode'
import { rpx2px } from '../../../utils/util'
import { hex2b64 } from '../../../utils/base64.js'
import { ChiperFactory } from '../../../models/ChiperFactory'
import { push } from '../../../models/storage'

var ALGORITHMS = [{
  title: '无',
  getChiper: null
}, {
  title: 'RSA-1024',
  getChiper() {
    let Chiper = ChiperFactory.getChiperClass('RSAChiper')
    let newChiper = new Chiper()
    let privateKey = newChiper.generate(1024)
    return { newChiper, privateKey }
  }
}, {
  title: 'RSA-2048',
  getChiper() {
    let Chiper = ChiperFactory.getChiperClass('RSAChiper')
    let newChiper = new Chiper()
    let privateKey = newChiper.generate(2048)
    return { newChiper, privateKey }
  }
}]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    init: false,
    algorithms: ALGORITHMS,
    getChiper: null,
    newChiper: null,
    chiperName: ALGORITHMS[0].title,
    isGenerating: false,
    disable_ok: true,
    disable_save: true
  },

  algorithmChanging(e) {
    this.setData({
      chiperName: ALGORITHMS[e.detail.value].title,
      getChiper: ALGORITHMS[e.detail.value].getChiper
    })
  },

  genQRCode() {
    if (this.data.isGenerating) return
    if (this.data.getChiper === null) {
      wx.showToast({
        title: '请选择算法',
        image: '/res/alert.png'
      })
      return
    }
    else {
      this.setData({ isGenerating: true })

      let { newChiper, privateKey } = this.data.getChiper()
      this.setData({
        newChiper,
        isGenerating: false,
        disable_ok: true,
        disable_save: false
      })
      QRcode.draw(privateKey, 'qrcode', rpx2px(600), rpx2px(600))
    }
  },

  saveToAlbum() {
    wx.canvasToTempFilePath({
      canvasId: 'qrcode',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({ title: '保存成功' })
            this.setData({
              disable_ok: false,
              disable_save: true
            })
          }
        })
      }
    })
  },

  setChiper() {
    getApp().chiper = this.data.newChiper
    push()
    if(this.data.init === 'true') wx.switchTab({ url: '/pages/pwList/pwList' })
    else wx.navigateBack()
  },

  onLoad(option){
    this.setData({
      init: option.init
    })
  }
})