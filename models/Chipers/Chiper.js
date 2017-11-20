import { strToBase64, base64ToStr } from '../../utils/util'
import { SHA256 } from './algorithm/sha256/sha256.js'
/**
 * 加密器的抽象类
 */
export class Chiper{
  /** @property {string} _publicKey - 公钥 */
  _publicKey = null
  /** @property {string} _privateKey - 私钥 */
  _privateKey = null
  /** @property {string} _privateKeyHash - 私钥hash */
  _privateKeyHash = null

  /** @property {number} _timerID - 定时器ID */
  _timerID = null
  
  /** @property {function(leftTime)} onTimeChange - 当私钥剩余留存时间改变时触发 */
  onTimeChange = null
  /** @property {function()} onLock - 当私钥被销毁时触发 */
  onLocked = null
  
  
  constructor(publicKey, privateKeyHash){}

  /** 设置私钥，并在一段时间后删除
   * @param {string} privateKey - 私钥
   * @param {number?} duration - 私钥保存时间（单位: 秒, 默认为30秒）
   */
  unlock(privateKey, duration = 30){
    this._privateKey = privateKey
    if(!this.decryptAvaliable()) return false
    let lifeTime = duration
    let self = this

    this._timerID = setInterval(()=>{
      if (lifeTime === 0){
        self.lock()
      }
      else if (this.onTimeChange) this.onTimeChange(lifeTime)
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
    if (this.onLocked) this.onLocked()
  }
  
  /** 加密函数
   * @param {string} msg - 明文
   * @return {string} - 密文
   */
  encrypt(msg){}

  /** 解密函数
   * @param {string} msg - 明文
   * @return {string} - 密文
   */
  decrypt(cmsg) {}

  /** 检查是否能解密 */
  decryptAvaliable(){}

  /** 
   * 生成/更新公私钥对,并更新该实例的公钥与私钥hash
   * @return {string} - 序列化的私钥
   * */
  generate(){}

  static serialize(obj){}
  static deserialize(str){}
}