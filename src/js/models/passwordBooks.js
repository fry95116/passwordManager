var RSAKey = require('./libs/rsa.js')
var sha256 = require('sha256')

var KEY_LOCALSTORAGE = "PASSWORDBOOKS"
 
class PasswordBooks{
    constructor(){
        this._data = {}
        
        if(window && window.localStorage){
            if(window.localStorage.getItem(KEY_LOCALSTORAGE) !== null){
                //TODO: 读取localstorage中的数据
                pull()
            }
        }
        else throw new Error('localStorage not supported')
    }

    /**
     * 创建密码本，并返回解密所需的私钥
     * @return
     */
    create(name){
        if(this._data[name] != null) throw new Error('name exists')
        var ret = {
            passwordBook:new PasswordBook(), 
            privateKey:null
        }
        var keygen = new RSAKey()
        // generate
        keygen.generate(1024, '10001')
    
        ret.privateKey = keygen.getPrivate_encrypted()
        ret.passwordBook._publicKey = keyen.getPublic()
        ret.passwordBook._sign_privateKey = sha256(ret.privateKey)


        return ret
    }

    PushToLocalStorage(){
        if(window && window.localStorage){
            window.localStorage.setItem(KEY_LOCALSTORAGE, JSON.stringify(this._data))
        }
        else throw new Error('localStorage not supported')
    }

    PullFromLocalStorage(){
        if(window && window.localStorage){
            var rawData = window.localStorage.getItem(KEY_LOCALSTORAGE)
            //TODO: 类型检查
            this._data = JSON.parse(rawData)
        }
        else throw new Error('localStorage not supported')
    }
    
    import(str_rawData){

    }

    export(){

    }
}


class PasswordBook{
    constructor(){
        this._publicKey = null
        this._sign_privateKey = null
        this._pages = {}
    }

    addPage(){

    }

    removePage(){

    }

    getPageNames(){

    }

    decryptPages(privateKey){

    }

    toJSON(){

    }

    static fromJSON(){
        
    }
}

if(module.exports) module.exports = new PasswordBooks()