import { strToBase64, base64ToStr } from '../../utils/util'
import { SHA256 } from './algorithm/sha256/sha256.js'
/**
 * 加密器的抽象类
 */
export class Chiper{
  /** 构造器，依据加密使用的密钥创建加密器 */

  className = 'Chiper'
  /** @protected {Object} _publicKey - 公钥 */
  _publicKey = null
  /** @protected {Object} _privateKey - 私钥 */
  _privateKey = null
  /** @protected {string} _privateKeyHash - 私钥hash */
  _privateKeyHash = null

  /** @private {number} _timerID 定时器ID */
  _timerID = null
  
  // set publicKeygen(v){
  //   this._publicKey = v
  // }

  constructor(obj){
    if(typeof(obj) === 'Object'){ 
      // 从现有对象复制
      this._publicKey = obj._publicKey
      this._privateKeyHash = obj._privateKeyHash
    } 
    else if (typeof (obj) === 'string')
      // 由公钥生成
      this._publicKey = obj._publicKey
  }

  /** 设置私钥，并在一段时间后删除 */
  unlock(key, onTimeChange, onLock, duration = 30){
    this._privateKey = this._parseKey(key)
    let lifeTime = duration
    let self = this

    this._timerID = setInterval(()=>{
      if (lifeTime === 0){
        self.lock()
        if (typeof (onLock) === 'function') onLock()
      }
      else{
        if (typeof (onTimeChange) === 'function') onTimeChange(lifeTime)
      }

      lifeTime--
    }, 1000)

    return true
  }

  /** 删除私钥 */
  lock(){
    this._privateKey = null
    if(this._timerID !== null){
      clearInterval(this._timerID)
      this._timerID = null
    }
  }
  
  /** 加密函数
   * @param {string} msg - 明文
   * @return {string} - 密文
   */
  encrypt(msg){
    return this._encrypt(msg, this._publicKey)
  }

  /** 解密函数
   * @param {string} msg - 明文
   * @return {string} - 密文
   */
  decrypt(cmsg) {
    if(this.decryptAvaliable())
      return this._decrypt(cmsg, this._privateKey)
    else
      return null
  }

  /** 检查是否能解密 */
  decryptAvaliable(){
    if(this._privateKey === null) return false

    let hash = SHA256(this._privateKey.d)
    return this._privateKeyHash === hash
  }

  /*****************************
   *     virtual functions     *
   *****************************/
  
  /** 加密方法(默认实现为base64编码)
   * @param {string} msg - 明文
   * @param {Object} k - 公钥
   * @return {string} - 密文
   */
  _encrypt(msg, k) {
    return strToBase64(msg)
  }

  /** 解密方法(默认实现为base64解码)
   * @param {string} msg - 密文
   * @param {Object} k - 私钥
   * @return {string} - 明文
   */
  _decrypt(cmsg, k) {
    return base64ToStr(cmsg)
  }

  /** 
   * 生成/更新公私钥对,并更新该实例的公钥与私钥hash
   * @return {string} - 序列化的私钥
   * */
  generate(){
    this._publicKey = null
    return null
  }

  /** 解析字符串为私钥（用于反序列化generate()中返回的私钥字符串） 
   * @param {string} - 序列化的私钥
  */
  _parseKey(key){}
}