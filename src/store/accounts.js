import Account from './Account'
import {pull, push} from './storage'
import md5 from 'md5'
const ID_ACCOUNTS = 'accounts'

export default {
  namespaced: true,
  state: {
    /**
     * 加密过的账户信息
     * 格式:{HASH:Account.stringify(in)}
     **/
    data: deserialize(pull(ID_ACCOUNTS, '{}'))
  },

  mutations: {
    /**
     * 添加账户信息
     * @param {Account} newAccount - 新的账户信息
     */
    add(state, {newAccount}) {
      let ID = md5(newAccount.name)
      if(!_.isUndefined(state.data[ID])) throw new Error('Account exist')
      
      let now = _.now()
      newAccount.time_create = now
      newAccount.time_latestUpdate = now

      state.data[ID] = encrypt(Account.stringify(newAccount))

      push(ID_ACCOUNTS, JSON.stringify(state.data))
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
 * @param {string[]} data - 加密过的账户信息序列
 * @return {string} - 序列化后的数据 
 */
function serialize(data){
  return JSON.stringify(data)
}

/**
 * 反序列化Accounts序列
 * @param {string} data - 序列化的数据
 * @return {string[]} - 账户信息序列 
 */
function deserialize(data){
  let src = ''
  try{
    src = JSON.parse(data)
  }
  catch(e){
    throw new Error(`error on parsing: ${e.msg}`)
  }
  if(!_.isObject(src)) throw new Error('error on parsing: type error') 
  if(_.find(src, value=>!_.isString(value))) throw new Error('error on parsing: type error')
  
  return res
}