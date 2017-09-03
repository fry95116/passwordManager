import _ from 'lodash'
import {CHARSETS} from '../RPGA'

export default {
  namespaced: true,
  state: {
    length: 8,
    charsets: ['lowerCase', 'upperCase', 'number']
  },
  getters: {
    charset(state){
      let charset = ''
      _.forIn(state.charsets, name=>{charset += CHARSETS[name] || ''})
      return charset
    }
  },
  mutations: {
    /** 
     * 设置密码长度
     * @param {number} length - 新的密码长度
     **/
    setLength(state, {length}) {

      if(/^\d+$/.test(length)) state.length = parseInt(length)
    },

    /**
     * 设置密码字符集
     * @param {string[]} charsets - 新的字符集名称数组
     **/
    setCharsets(state, {charsets}){
      if(_.isArray(charsets)) {
        state.charsets = _.intersection(charsets, _.keys(CHARSETS))
      }
    }
  }
}