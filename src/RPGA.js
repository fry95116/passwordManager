import _ from 'lodash'

/** 缺省字符集 */
export const CHARSETS = {
  upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowerCase: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  specialSymbol: '!@#$%^&*'
}

/**
 * 生成随机密码
 * @param {string} charset - 随机密码所用的字符集合
 * @param {unmber} length - 随机密码的长度
 * @return {string} - 生成的随机密码
 */
export function generatePassword(charset, length){
  
  let password = ''  
  let range = charset.length - 1
  for(let i = 0; i < length; ++i){
    password += charset[_.random(0, range)]
  }
  return password
}