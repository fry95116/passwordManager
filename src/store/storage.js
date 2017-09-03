/**
 * 数据持久化层
 * 注意：这部分不负责数据的序列化/反序列化（serialize/deserialize）操作
 */

const Storage = window.localStorage

/**
 * 从localstorage中获取信息
 * @param {string} key - 数据项名称
 * @param {string} initData - 如果数据不存在,存入localstorage并返回的数据
 * @param {string} - 读取到的数据
 */
export function pull(key, initData){
  let result = Storage.getItem(key)
  if(result === null){
    Storage.setItem(key, initData)
    return initData
  }
  else return result
}

/**
 * 将数据存入loaclstorage中
 * @param {string} key - 数据项名称
 * @param {string} data - 数据
 */
export function push(key, data){
  Storage.setItem(key, data)
}
