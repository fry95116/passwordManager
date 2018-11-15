var passwordBooks = require('../models/passwordBooks')
var RSAKey = require('../libs/rsa')
var sha256 = require('sha256')
var isNil = require('lodash.isnil')

class PrivateKeyManager{
    constructor(){
        this._privateKey = null
        this._name = ''
        this._seconds_retention = 5
        this._timerID = -1
    }

    get name(){
        return this._name
    }

    get privateKey(){
        return this._privateKey
    }

    get seconds_retention(){
        return this._seconds_retention
    }

    set seconds_retention(val){
        this._seconds_retention = val
    }

    setPrivateKey(name, str_privateKey){
        var sign = sha256(str_privateKey)
        var passwordBook = passwordBooks.data[name]

        if(isNil(passwordBook)){
            throw new Error('passwordBook not exist')
        }
        if(passwordBook.sign_privateKey !== sign){
            throw new Error('sign not matched')
        }

        this._privateKey = new RSAKey()
        this._privateKey.setPublic(passwordBook.publicKey.n, passwordBook.publicKey.e)
        this._privateKey.setPrivate_encrypted(str_privateKey)
        this._name = name

        if(this._seconds_retention > 0){
            if(this._timerID !== -1) clearTimeout(this._timerID)
            this._timerID = setTimeout(()=>{
                this._privateKey = null
                this._name = ''
            }, this._seconds_retention * 1000)
        }
    }

    clearPrivateKey(){
        this._privateKey = null
        this._name = null
        clearTimeout(this._timerID)
    }
}

module.exports = new PrivateKeyManager()