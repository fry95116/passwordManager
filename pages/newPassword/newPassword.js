// pages/pwList/newPassword/newPassword.js

import {TAGS, DEFAULT_ITEM_KEYS} from '../../models/enums'
import {Info} from '../../models/Info'
import {push} from '../../models/storage'
Page({
  data: initData(),

  /***** 名称 *****/
  nameTyping(e) {
    const APP = getApp()
    let newData = { name: e.detail.value, error_name: false }
    if(APP.infos.isInfoExist(e.detail.value))
      newData.error_name = '名称重复'
    this.setData(newData)
  },

  /***** 标签 *****/
  tagChange(e){this.setData({ tagIndex: e.detail.value })},
  
  /***** 具体信息项 *****/
  setPrimaryItem(e) {
    this.setData({ primaryItemIndex: e.currentTarget.dataset.index})
  },
  deleteItem(e){
    wx.showModal({
      title: '确认删除',
      content: '确定删除该条信息？',
      confirmText: "确定",
      cancelText: "取消",
      success: (res)=>{
        if (res.confirm) {
          let newData = {
            newInfo_items: this.data.newInfo_items
          }
          let pos = e.currentTarget.dataset.index
          
          newData.newInfo_items.splice(pos, 1)
          if (this.data.primaryItemIndex === pos) 
            newData.primaryItemIndex = Math.max(pos - 1, 0)
          if (newData.newInfo_items.length === 0)
            newData.primaryItemIndex = -1
          this.setData(newData)
        }
      }
    })
  },

  /***** 添加信息项 *****/
  newItemKeyChanging(e){
    if(e.detail.value !== -1) 
      this.setData({newItem_key: this.data.enum_itemKeys[e.detail.value]})
  },

  newItemValueTyping(e){
    let newData = {
      newItem_value: e.detail.value,
      error_newItem_value: false
    }
    if (this.data.error_newInfo_items)
      newData.error_newItem_value = false
    this.setData(newData)
  },

  addItem(){
    if (this.data.newItem_value === ''){
      this.setData({error_newItem_value: true})
      return
    }

    let newData = {
      newInfo_items: this.data.newInfo_items,
      newItem_value: ''
    }
    if(this.data.error_newInfo_items)
      newData.error_newInfo_items = false
    if (newData.newInfo_items.length === 0)
      newData.primaryItemIndex = 0
    
    newData.newInfo_items.push({
      key: this.data.newItem_key,
      value: this.data.newItem_value
    })
    if (this.data.error_newInfo_items)
      newData.error_newInfo_items = false
    this.setData(newData)
  },

  // 添加信息  
  addInfo(){
    const APP = getApp()
    /** 合法性检查 **/
    let isValid = true
    let newData = {}
    if (this.data.name === ''){
      newData.error_name = '名称不能为空'
      isValid = false
    }
    if (APP.infos.isInfoExist(this.data.name)) {
      newData.error_name = '名称重复'
      isValid = false
    }
    if (this.data.newInfo_items.length === 0){
      newData.error_newInfo_items = '信息条目不能为空'
      isValid = false
    }
    if(!isValid) {
      this.setData(newData)
      return
    }

    /** 添加逻辑 **/
    let newInfo = new Info(this.data.name, this.data.enum_tags[this.data.tagIndex].bgColor)
    newInfo.primaryItemIndex = this.data.primaryItemIndex
    // deep clone
    this.data.newInfo_items.forEach(({key, value})=>{
      newInfo.items.push({key, value})
    })

    APP.infos.addInfo(newInfo, APP.chiper)
    push('infos', APP)
    wx.switchTab({
      url: '/pages/pwList/pwList',
      success(){
        wx.showToast({ title: '添加成功' })
      }
    })
    this.setData(initData())
  },
  
  // 生命周期函数--监听页面初次渲染完成
  onReady() {
    this.setData(initData())
  }
})

// 重置数据
function initData() {
  return {
    name: '',
    tagIndex: 0,
    enum_tags: TAGS,
    primaryItemIndex: -1,
    newInfo_items: [],

    newItem_key: '密码',
    enum_itemKeys: DEFAULT_ITEM_KEYS,
    newItem_value: '',

    isPromptShown: false,

    error_name: false,
    error_newItem_value: false,
    error_newInfo_items: false,
  }
} 