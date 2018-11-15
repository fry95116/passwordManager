var RSAKey = require('../libs/rsa.js')
var sha256 = require('sha256')

var KEY_LOCALSTORAGE = "PASSWORDBOOKS"

class PasswordBooks {
    constructor() {
        this._data = {}

        if (window && window.localStorage) {
            if (window.localStorage.getItem(KEY_LOCALSTORAGE) !== null) {
                //TODO: 读取localstorage中的数据
                this._pullFromLocalStorage()
            }
        }
        else throw new Error('localStorage not supported')
    }

    /**
     * 添加新的密码本
     * @param {PasswordBook} newPasswordBook - 新的密码本
     * @throws {Error} - 没用对象传入，或者密码本名称已经存在
     */
    add(newPasswordBook) {
        if (!(newPasswordBook instanceof PasswordBook)) throw new Error('passwordBook required')
        if (this._data[newPasswordBook.name] != null) throw new Error('name exists')

        this._data[newPasswordBook.name] = newPasswordBook
        // 同步到localstorage
        this._pushToLocalStorage()
    }

    /**
     * 获取存储的密码本的名称
     * @return {Array[string]} - 密码本的名称
     */
    getPasswordBookNames() {
        return Object.keys(this._data)
    }

    /**
     * 获取密码本
     * @param {string} name - 密码本的名称
     * @return {PasswordBook|null} - 对应的密码本
     */
    getPasswordBook(name){
        if(name in this._data) return this._data[name]
        else return null
    }
    /**
     * 将所有密码本存储至localstorage中
     * @throws {Error} -  localstorage不被支持
     */
    _pushToLocalStorage() {
        if (window && window.localStorage) {
            window.localStorage.setItem(KEY_LOCALSTORAGE, this.export())
        }
        else throw new Error('localStorage not supported')
    }

    /**
     * 从localstorage中获取密码本
     * @throws {Error} -  localstorage不被支持
     */
    _pullFromLocalStorage() {
        if (window && window.localStorage) {
            this.import(window.localStorage.getItem(KEY_LOCALSTORAGE))
        }
        else throw new Error('localStorage not supported')
    }

    /**
     * 从原始字符串中导入密码本（反序列化）
     * @param {string} str_rawData
     */
    import(str_rawData) {
        //TODO: 类型检查
        var obj = JSON.parse(str_rawData)

        for (var key in obj) {
            this._data[key] = new PasswordBook(obj[key])
        }
    }

    /**
     * 将密码本导出为字符串（序列化）
     * @return {string} - 序列化后的字符串
     */
    export() {

        var ret = {}

        for (var key in this._data) {
            ret[key] = this._data[key].toObject()
        }
        return JSON.stringify(ret)
    }
}

/** @typedef {{name: string, _publicKey: {n: string, e: string}, _sign_privateKey: string, _pages: Object<string>} RawObject */
/** @typedef {{name: string, key_primary: string, items: {}}} Page */

class PasswordBook {

    /**
     * 构造函数
     * @param {(string|RawObject)} a 
     * @param {RSAKey} [b] 
     */
    constructor(a, b) {
        if (typeof (a) === 'object') {
            this._clone(a)
        }
        else this._constructor(a, b)
    }

    /**
     * 构造函数
     * @param {string} name - 密码本的名称
     * @param {RSAKey} keygen - 使用的密钥
     * @return
     */
    _constructor(name, keygen) {
        if (!(typeof (name) === 'string' && name !== '')) throw new Error('invalid name: string required')
        if (!(keygen instanceof RSAKey)) throw new Error('invalid keygen: RSAKey required')

        this.name = name
        this._publicKey = keygen.getPublic()
        this._sign_privateKey = sha256(keygen.getPrivate_encrypted())
        this._pages = {}
    }

    /**
     * 复制构造函数，用于序列化和反序列化
     * @param {RawObject} obj - 
     * 由`PasswordBook.toObject()`得到的Object类型的值
     */
    _clone(obj) {
        // TODO: 合法性检查
        this.name = obj.name
        this._publicKey = obj._publicKey
        this._sign_privateKey = obj._sign_privateKey
        // this._pages = obj._pages

        this._pages = {}
        for(key in obj._pages){
            this._pages[key] = new Page(obj._pages[key])
        }
    }

    /**
     * 返回该类实例中的所有属性用于序列化
     * @return {RawObject} - 各个属性
     */
    toObject() {

        var rawPages = {}
        for(key in this._pages){
            rawPages[key] = this._pages[key].toObject()
        }
        return {
            name: this.name,
            _publicKey: this._publicKey,
            _sign_privateKey: this._sign_privateKey,
            _pages: rawPages
        }
    }

    /**
     * 添加页
     * @param {Page} page - 新的页
     */
    addPage(page) {
        if (page.name in this._pages) throw new Error('page name exists')
        // TODO: 类型检查
        var plain = JSON.stringify(page)
        var keygen = new RSAKey()
        keygen.setPublic(this._publicKey.n, this._publicKey.e)
        this._pages[name] = keygen.encrypt(plain)
    }

    /**
     * 删除页
     * @param {string} pageName - 要删除的页的名称
     */
    removePage(pageName) {
        if (pageName in this._pages)
            delete this._pages[pageName]
    }

    /**
     * 获取当前所有的页的名称列表
     * @return {Array[string]} - 页名列表
     */
    getPageNames() {
        return Object.keys(this._pages)
    }

    /**
     * 解密该密码本
     * @param {string} privateKey - 私钥
     * @return {Array[Page]} - 密码本中的各个页面
     * @throws {Error} - 私钥错误时
     */
    decryptPages(privateKey) {
        if(sha256(privateKey) !== this._sign_privateKey) throw new Error('invalid privateKey')
        try {
            var key_private = new RSAKey()
            key_private.setPrivate_encrypted(privateKey)
        }
        catch(err) {throw new Error('invalid privateKey')}
        
        var ret = []
        for(var page of this._pages){
            ret.append(key_private.decrypt(page))
        }
        return ret
    }
}

class Page{

    /**
     * 构造函数
     * @param {(string|RawObject)} a 
     */
    constructor(a, b) {
        if (typeof (a) === 'object') {
            this._clone(a)
        }
        else this._constructor(a)
    }

    /**
     * 构造函数
     * @param {string} name - 页面的名称
     * @return
     */
    _constructor(name) {
        if (!(typeof (name) === 'string' && name !== '')) throw new Error('invalid name: string required')

        this.name = name
        this.primaryInfo = ''
        this.remarks = ''
        // TODO: 各个属性
    }

    /**
     * 复制构造函数，用于序列化和反序列化
     * @param {RawObject} obj - 
     * 由`PasswordBook.toObject()`得到的Object类型的值
     */
    _clone(obj) {
        // TODO: 合法性检查
        this.name = obj.name
        this.primaryInfo = obj.primaryInfo
        this.remarks = obj.remarks

    }

    /**
     * 返回该类实例中的所有属性用于序列化
     * @return {RawObject} - 各个属性
     */
    toObject() {
        return {
            name: this.name,
            primaryInfo: this.primaryInfo,
            remarks: this.remarks
        }
    }
}

if (module.exports) {
    module.exports.passwordBooks = new PasswordBooks()
    module.exports.PasswordBook = PasswordBook
}

var data = {}

/**
 * 添加密码本
 * @param {{name: string, keygen: RSAKey}} obj 
 */
function addPasswordBooks(obj){

}

/**
 * 删除密码本
 * @param {string} name - 密码本名称
 */
function deletePasswordBooks(name){

}


function addPage(name, obj){

}

function deletePage(passwordBookName, pageName){

}

