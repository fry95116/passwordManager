import { Chiper } from './Chipers/Chiper'
import { RSAChiper } from './Chipers/RSAChiper.js'
import { isNotNil } from '../utils/util.js'

const KEY_STORAGE = 'model'

const CHIPERS_FACTORY = {
    _chipers:{
        RSAChiper(){return new RSAChiper()}
    },
    getChiper(name){
        if(isNotNil(this._chipers[name])) return new this._chipers[name]
        else throw new Error('this chiper is not supportted')
    }
}

export class Model {
    MASK = { key: '', value: '●●●●●●●●' }
    infos = new Object()
    chiper = null // chiper
    settings = {
        rpga: {
            length: 8,
            lowerCase: true,
            upperCase: true,
            num: true,
            specialSymbol: true
        },
        duration: 30
    }

    constructor(obj) { }

    setChiper(chiper) {
        this.chiper = chiper
        this.push()
    }

    /** 添加信息
     * @param {Info} info - 新的信息
     * @return {boolean} - 如果info.name在序列中已经存在，返回false；否则返回true。
     */
    addInfo(info) {
        if (this.isInfoExist(info)) return false
        else {
            // 加密
            let msg = this.chiper.encrypt(JSON.stringify(info))
            // 添加
            this.infos[info.name] = msg
            this.push()
            return true
        }
    }

    /** 删除信息
     * @param {Info|string} info - Info对象或者info.name
     */
    removeInfo(info) {
        delete this.infos[_getName(info)]
        this.push()
    }

    /** 更新`name`为`info.name`的信息
     * @param {Info} info - 新的信息
     * @return {boolean} - 如果info.name在序列中不存在，返回false；否则返回true。
     */
    updateInfo(info) {
        if (info || typeof (info.name) !== 'string') return false
        if (isInfoExist(info)) return false
        // 加密
        let msg = this.chiper.encrypt(JSON.stringify(info))
        // 更新
        this.infos[info.name] = info
        this.push()
        return true
    }

    /** 检查name相同的信息是否存在
     * @param {Info|string} info - Info对象或者info.name
     * @return {boolean} - 信息是否存在
     */
    isInfoExist(info) {
        return typeof (this.infos[_getName(info)]) !== 'undefined'
    }

    /** 如果私钥存在，返回解密后的信息数组，否则返回带mask的数组
     * @return {Array} - 信息数组
     */
    getInfoList() {
        let res = []
        if (this.chiper && this.chiper.decryptAvaliable()) {
            try {
                for (let name in this.infos) {
                    // 解密
                    let info = JSON.parse(this.chiper.decrypt(this.infos[name]))
                    res.push({
                        name,
                        tag: info.tag,
                        primaryItem: info.items[info.primaryItemIndex]
                    })
                }
                return res
            }
            catch (e) {
                wx.showToast({ title: '解密失败', image: '/res/alert.png' })
                return []
            }
        }
        else {
            for (let name in this.infos) {
                res.push({
                    name,
                    primaryItem: this.MASK
                })
            }
            return res
        }
    }

    /** 序列化当前实例并存储在localStorage中
     */
    push() {
        // serialize chiper

        // serialize
        let data = JSON.stringify({
            infos: this.infos,
            chiperClass: this.chiper.className,
            chiper: {
                _publicKey: this.chiper._publicKey,
                _privateKeyHash: this.chiper._privateKeyHash
            },
            settings: this.settings
        })
        // push action
        wx.setStorage({
            key: KEY_STORAGE,
            data,
            fail() {
                console.log('push failed')
            }
        })
    }

    /** 从localStorage中获取model
     * @param {function} cb - 完成时的回调函数
     */
    static load(cb) {
        // load action
        wx.getStorage({
            key: KEY_STORAGE,
            success(res) {
                // 反序列化
                try {
                    cb(null, new Model(JSON.parse(res.data)))
                }
                catch (e) {
                    console.error('json parse failed')
                    cb(e, null)
                }
            },
            fail: () => cb(new Error('get Storage failed'), null)
        })
    }
}

function _getName(info) {
    if (typeof (info) === 'string')
        return info
    else
        return info.name
}