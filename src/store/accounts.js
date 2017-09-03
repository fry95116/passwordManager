import Account from './Account'
import {pull, push} from './storage'

const ID_ACCOUNTS = 'accounts'

export default {
  namespaced: true,
  state: {
    data: null
  },

  // getters: {
  //   decrypted(){
  //     return this.data
  //   }
  // },
  mutations: {
    /**
     * 传入秘钥解密信息
     * @param {RSAKey} primaryKey - 用于解密的私钥
     */
    unlock(state, {primaryKey}){
      state.data = deserialize(pull(ID_ACCOUNTS, '[]'))
    },
    /**
     * 清除明文
     */
    lock(state){
      state.data = null
    },
    /**
     * 添加账户信息
     * @param {Account} newAccount - 新的账户信息
     */
    add(state, {newAccount}) {
      // if(!(newAccount instanceof Account))
      //   throw('newAccount must be a instance of Account')
      //main proc
      let pos = _.findIndex(state.data, el=>el.name === newAccount.name)
      if(pos !== -1) return

      let now = _.now()
      newAccount.time_create = now
      newAccount.time_latestUpdate = now
      state.data.push(newAccount)

      push(ID_ACCOUNTS, serialize(state.data))
    },
    
    remove(state, {name}) {
      //main proc
      let pos = _.findIndex(state.data, el=>el.name === name)
      if(pos === -1) return 
      
      state.data.splice(pos, 1)
      push(ID_ACCOUNTS, serialize(state.data))
    },

    update(state, {name, newAccount}) {
      if(_.isNil(name) || name === '') throw('name required')
      if(!(newAccount instanceof Account)) throw('newAccount must be a instance of Account')
      //main proc
      let pos = _.findIndex(state.data, el=>el.name === name)
      if(pos !== -1) {
        newAccount.time_latestUpdate = _.now()        
        state.data.splice(pos, 1, newAccount)
      }
      push(ID_ACCOUNTS, serialize(state.data))
    }
  }
}

/**
 * 序列化Accounts序列
 * @param {Account[]} data - 账户信息序列
 * @return {string} - 序列化后的数据 
 */
function serialize(data){
  return JSON.stringify(data)
}

/**
 * 反序列化Accounts序列
 * @param {string} data - 序列化的数据
 * @return {Account[]} - 账户信息序列 
 */
function deserialize(data){
  let res = JSON.parse(data)
  if(_.isArray(res)){
    return _.map(res, el=>new Account(el))
  }
  else throw new Error('data is not a Array')
}