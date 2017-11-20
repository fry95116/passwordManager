// pages/pwList/pwList.js

Page({

  /** 页面的初始数据 */
  data: {
    inputShowed: false,
    inputVal: "",
    rotateDeg: 0,
    infos: [],
    isDataVisiable: false,
    dx: {}
  },

  toAddInfo(){
    wx.switchTab({url: '/pages/newPassword/newPassword'})
  },

  // searchBar 
  showInput(){this.setData({inputShowed: true})},
  hideInput(){this.setData({inputVal: "",inputShowed: false})},
  clearInput(){this.setData({inputVal: ""})},
  inputTyping(){this.setData({inputVal: e.detail.value})},
  // list

  onTouchStart(e) {
    if (e.touches.length === 1)
      this.setData({startX: e.touches[0].clientX})
  },

  onTouchMove(e) {
    if (e.touches.length !== 1) return

    var moveX = e.touches[0].clientX //记录触摸点位置的X坐标
    var newDx = this.data.startX - moveX
    newDx = newDx > 0 ? Math.min(newDx, 68) : 0

    var index = e.currentTarget.dataset.index
    var {dx} = this.data
    dx[index] = newDx
    this.setData({dx})
  },

  onTouchEnd(e) {
    if (e.changedTouches.length !== 1) return

    var endX = e.changedTouches[0].clientX;
    var newDx = this.data.startX - endX;
    newDx = newDx >= (68 / 2) ? 68 : 0

    var index = e.currentTarget.dataset.index
    var { dx } = this.data
    dx[index] = newDx
    this.setData({ dx })
  },

  deleteInfo(e){
    var key = e.currentTarget.dataset.key;
    // console.log('del ' + key)
    var model = getApp().model
    model.removeInfo(key)
    this.setData({
      infos: model.getInfoList(model.chiper),
      dx: {}
    })
  },

  //action button

  unlockData(privateKeygen){
    const APP = getApp()
    // 此处减1是为了与动画对应
    // set onTimeChange & onLock
    // (lifetime)=>,
    // ()=>this.lockData(),
    let chiper = APP.chiper
    let duration = APP.settings.duration
    APP.chiper.onTimeChange = (timeLeft)=> this.setData({rotateDeg: 360 - Math.ceil(360 * ((timeLeft - 1) / duration))})
    APP.chiper.onLocked = this.lockData
    let unlocked = APP.chiper.unlock(privateKeygen, duration)

    this.setData({
      infos: APP.infos.getInfoList(chiper),
      isDataVisiable: unlocked,
      rotateDeg: 0
    })
  },

  lockData(){
    const APP = getApp()
    this.setData({
      infos: APP.infos.getInfoList(),
      isDataVisiable: false
    })
  },

  scanCode: function () {
    wx.scanCode({
      success: (res) => {
        this.unlockData(res.result)
      },
      fail: function () {
        wx.showToast({title: '扫码失败',image: '/res/alert.png'})
      }
    })
  },

  // 生命周期函数--监听页面显示
  onShow: function () {
    let {infos, chiper} = getApp()
    if(infos){
      this.setData({ 
        infos: infos.getInfoList(chiper),
        isDataVisiable: chiper.decryptAvaliable(),
        rotateDeg: 0
      })
    }
  },
  // 生命周期函数--监听页面隐藏
  onHide() {
    this.lockData()
  }
})