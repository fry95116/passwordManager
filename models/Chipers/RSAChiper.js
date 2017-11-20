import {RSAKey} from './algorithm/rsa/rsa.js'
import {Chiper} from './Chiper.js'
import {isNil, isNotNil} from '../../utils/util.js'
import {hex2b64, b64tohex} from '../../utils/base64.js'
import {SHA256} from './algorithm/sha256/sha256.js'

export class RSAChiper extends Chiper{
  _E = '3'

  constructor(){
    super()
  }

  /**
   * 加密的实现
   * @param {string} msg - 明文
   * @return {string} - 加密后的密文
   */
  encrypt(msg){
    let rsa = new RSAKey()
    let k = this._publicKey
    rsa.setPublic(k.n, k.e)
    return rsa.encrypt(msg)
  }
  /**
   * 解密的实现
   * @param {string} cmsg - 密文
   * @return {string} - 解密后的明文
   */
  decrypt(cmsg){
    let rsa = new RSAKey()
    rsa.setPrivate(this._publicKey.n, this._E, b64tohex(this._privateKey))
    return rsa.decrypt(cmsg)
  }

  decryptAvaliable() { 
    return isNotNil(this._privateKey)
  }
  /**
   * 生成公/私钥对, 并初始化该实例
   * @param {number} bitLength - 密钥长度
   * @return {string} 密钥的base64字符串形式
   */
  generate(bitLength){
    
    let rsa = new RSAKey()
    rsa.generate(bitLength, this._E)

    let n = rsa.n.toString(16)
    let e = this._E
    let d = rsa.d.toString(16)

    // 公钥与私钥的格式
    let publicKey = {n, e}, privateKey = {n, d}
    
    this._publicKey = publicKey
    d = hex2b64(d)
    this._privateKeyHash = SHA256(d)
    return d
  }

  decryptAvaliable() {
    if(isNil(this._privateKey)) return false
    let keyHash = SHA256(this._privateKey)
    return keyHash === this._privateKeyHash
    // return isNotNil(this._privateKey) && SHA256(this._privateKey) === this._privateKeyHash
  }


  /** serialize */
  static serialize(src){
    return JSON.stringify({
      _publicKey: src._publicKey,
      _privateKeyHash: src._privateKeyHash
    })
  }
  static deserialize(str){
    let res = new RSAChiper()
    let src = JSON.parse(str)
    res._publicKey = src._publicKey
    res._privateKeyHash = src._privateKeyHash
    return res
  }
}
