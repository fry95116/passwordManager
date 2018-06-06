
var RSAKey = require('rsa')

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
}

/**
 * 创建密码本，并返回解密所需的私钥
 * @return
 */
exports.createPasswordBook = function(){
    return {
        passwordBook:null, 
        privateKey:null
    }
}

exports.importPasswordBook = function(str){

}

exports.exportPasswordBook = function(passwordBook){

}
