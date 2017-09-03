import RSAKey from '../encrypt/rsa'
import * as util from '../encrypt/util'
export default {
  namespaced: true,
  state: {
    data: null
  },
  getters: {
    formatted(state, getters){
      if(state.data === null) return ''
      return state.data.id
    }
  },
  mutations: {
    /**
     * 生成一个新秘钥
     */
    generate(state, {byteCount = 1024, baseNum = 3} = {}) {
      let newKeygen = new RSAKey()
      newKeygen.generate(byteCount, '' + util.byte2Hex(baseNum))
      let {E, N} = newKeygen.getPublic()
      newKeygen.id = `RSA:${E}-${util.hex2b64(N)}`
      state.data = newKeygen
    },

    remove(state, {id}){

    }
  }

}