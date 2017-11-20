import { Chiper } from './Chipers/Chiper'
import { RSAChiper } from './Chipers/RSAChiper.js'
import { isNotNil, map } from '../utils/util.js'

export class Infos {
  _MASK = { key: '', value: '●●●●●●●●' }
  _data = new Object()

  constructor(obj) { }

  /** 添加信息
   * @param {Info} info - 新的信息
   * @param {Chiper?} chiper - 加密器，如果传入，新信息将被加密
   * @return {boolean} - 如果info.name在序列中已经存在，返回false；否则返回true。
   */
  addInfo(info, chiper) {
    if (this.isInfoExist(info)) return false
    else {
      // 加密
      let msg = JSON.stringify(info)
      if (isNotNil(chiper)) msg = chiper.encrypt(JSON.stringify(info))
      // 添加
      this._data[info.name] = msg
      return true
    }
  }

  /** 删除信息
   * @param {Info|string} info - Info对象或者info.name
   */
  removeInfo(info) {
    this._data[_getName(info)] = null
  }

  /** 更新`name`为`info.name`的信息
   * @param {Info} info - 新的信息
   * @param {Chiper?} chiper - 加密器，如果传入，新信息将被加密
   * @return {boolean} - 如果info.name在序列中不存在，返回false；否则返回true。
   */
  updateInfo(info, chiper) {
    if (info || typeof (info.name) !== 'string') return false
    if (isInfoExist(info)) return false
    // 加密
    let msg = JSON.stringify(info)
    if (isNotNil(chiper)) msg = this.chiper.encrypt(JSON.stringify(info))
    // 更新
    this._data[info.name] = info
    return true
  }

  /** 检查name相同的信息是否存在
   * @param {Info|string} info - Info对象或者info.name
   * @return {boolean} - 信息是否存在
   */
  isInfoExist(info) {
    return isNotNil(this._data[_getName(info)])
  }

  /** 如果加密器存在且可被用于解密，返回解密后的信息数组，否则返回带mask的数组
   * @param {Chiper?} chiper - 加密器，如果传入将被用于解密数据
   * @return {Array} - 信息数组
   */
  getInfoList(chiper) {
    if (isNotNil(chiper)) {
      if (chiper.decryptAvaliable()) {
        try {
          let res = []
          for (let key in this._data) {
            let info = JSON.parse(chiper.decrypt(this._data[key]))
            res.push({
              name: info.name,
              tag: info.tag,
              primaryItem: info.items[info.primaryItemIndex]
            })
          }
          return res
        }
        catch (e) {
          wx.showToast({ title: '解密失败', image: '/res/alert.png' })
          return this.getMaskedInfosList()
        }
      }
      else return this.getMaskedInfosList()
    }
    else {
      try {
        return map(this._data, (el) => {
          let info = JSON.parse(el)
          return {
            name: info.name,
            tag: info.tag,
            primaryItem: info.items[info.primaryItemIndex]
          }
        })
      }
      catch (e) {
        // wx.showToast({ title: '数据损坏或需要解密', image: '/res/alert.png' })
        return this.getMaskedInfosList()
      }
    }
  }

  getMaskedInfosList(){
    let res = []
    for (let key in this._data) {
      res.push({
        name: key,
        primaryItem: this._MASK
      })
    }
    return res
  }
  /** 序列化
   * @return {Infos} - Infos对象
   * @return {string} - 序列化后的字符串
   */
  static serialize(infos) {
    return JSON.stringify(infos)
  }

  /** 反序列化
   * @param {string} - 序列化后的字符串
   * @return {Infos} - 反序列化后的Infos对象
   */
  static deserialize(str) {
    try {
      let infos = new Infos()
      let res = JSON.parse(str)
      infos._MASK = res._MASK
      infos._data = res._data
      return infos
    }
    catch (e) {
      throw new Error('Infos deserialize failed')
    }
  }
}

function _getName(info) {
  if (typeof (info) === 'string')
    return info
  else
    return info.name
}