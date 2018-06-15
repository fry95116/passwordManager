var RSAKey = require('../libs/rsa.js')
var sha256 = require('sha256')

var KEY_LOCALSTORAGE = "PASSWORDBOOKS"
 
class PasswordBooks{
    constructor(){
        this._data = {}
        
        if(window && window.localStorage){
            if(window.localStorage.getItem(KEY_LOCALSTORAGE) !== null){
                //TODO: 读取localstorage中的数据
                this.pullFromLocalStorage()
            }
        }
        else throw new Error('localStorage not supported')
    }

    // create(name, keygen){
    //     if(this._data[name] != null) throw new Error('name exists')
    //     var ret = {
    //         passwordBook:new PasswordBook(), 
    //         privateKey:null
    //     }
    
    //     ret.passwordBook._publicKey = keygen.getPublic()
    //     ret.passwordBook._sign_privateKey = sha256(ret.privateKey)

    //     return ret
    // }

    /**
     * 添加新的密码本
     * @param {PasswordBook} newPasswordBook - 新的密码本
     * @throws - name exists
     */
    add(newPasswordBook){
        if(!(newPasswordBook instanceof PasswordBook)) throw new Error('passwordBook required')
        if(this._data[newPasswordBook.name] != null) throw new Error('name exists')

        this._data[newPasswordBook.name] = newPasswordBook
        // 同步到localstorage
        this.pushToLocalStorage()
    }

    pushToLocalStorage(){
        if(window && window.localStorage){
            window.localStorage.setItem(KEY_LOCALSTORAGE, this.export())
        }
        else throw new Error('localStorage not supported')
    }

    pullFromLocalStorage(){
        if(window && window.localStorage){            
            this.import(window.localStorage.getItem(KEY_LOCALSTORAGE))
        }
        else throw new Error('localStorage not supported')
    }
    
    import(str_rawData){
        //TODO: 类型检查
        this._data = JSON.parse(str_rawData)
    }

    export(){
        return JSON.stringify(this._data)
    }
}

class PasswordBook{
    
    /**
     * 创建密码本
     * @param {string} name - 密码本的名称
     * @param {RSAKey} keygen - 使用的密钥
     * @return
     */
    constructor(name, keygen){
        if(!(typeof(name) === 'string' && name !== '')) throw new Error('invalid name: string required')
        if(!(keygen instanceof RSAKey)) throw new Error('invalid keygen: RSAKey required')

        this.name = name
        this._publicKey = keygen.getPublic()
        this._sign_privateKey = sha256(keygen.getPrivate_encrypted())
        this._pages = {}
    }

    addPage(){

    }

    removePage(){

    }

    getPageNames(){
        return Object.keys(this._pages)
    }

    decryptPages(privateKey){

    }

    toJSON(){

    }

    static fromJSON(){
        
    }
}

if(module.exports) {
    module.exports.passwordBooks = new PasswordBooks()
    module.exports.PasswordBook = PasswordBook
}