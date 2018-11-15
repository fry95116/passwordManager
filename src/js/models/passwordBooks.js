var RSAKey = require('../libs/rsa.js')
var sha256 = require('sha256')

var KEY_LOCALSTORAGE = "PASSWORDBOOKS"

var data = {}

if (window && window.localStorage) {
    if (window.localStorage.getItem(KEY_LOCALSTORAGE) !== null) {
        importData(window.localStorage.getItem(KEY_LOCALSTORAGE))
    }
}
else throw new Error('localStorage not supported')

/**
 * 导入数据
 * @param {string} str - JSON字符串格式的数据
 */
function importData(str) {
    //TODO: 类型检查
    data = JSON.parse(str)
}

/**
 * 导入数据
 * @return {string} - JSON字符串格式的数据
 */
function exportData() {
    return JSON.stringify(data)
}

/**
 * 添加密码本
 * @param {{name: string, keygen: RSAKey}} obj 
 */
function addPasswordBook(obj) {
    if(obj.name in data) throw Error('name exists')
    data[obj.name] = {
        name: obj.name,
        publicKey: obj.keygen.getPublic(),
        sign_privateKey: sha256(obj.keygen.getPrivate_encrypted()),
        pages: {}
    }
    window.localStorage.setItem(KEY_LOCALSTORAGE, exportData(data))
}

/**
 * 删除密码本
 * @param {string} name - 密码本名称
 */
function deletePasswordBook(name) {
    delete data[name]
    window.localStorage.setItem(KEY_LOCALSTORAGE, exportData(data))
}

/**
 * 
 * @param {string} name - 密码本名称
 * @param {{name: string, primaryInfo: string, remark: string}} obj - 新的页面
 */
function addPage(name, obj) {
    if(!(name in data)) throw Error('passwordBook not exists')
    var passwordBook = data[name]
    if(obj.name in passwordBook.pages) throw Error('page exists')
    
    var key = new RSAKey()
    key.setPublic(passwordBook.publicKey.n, passwordBook.publicKey.e)
    var chiperText = key.encrypt(JSON.stringify(obj))
    data[name].pages[obj.name] = chiperText

    window.localStorage.setItem(KEY_LOCALSTORAGE, exportData(data))

}

function deletePage(passwordBookName, pageName) {

}


if (module.exports) {
    module.exports.data = data
    module.exports.importData = importData
    module.exports.exportData = exportData
    module.exports.addPasswordBook = addPasswordBook
    module.exports.addPage = addPage
}