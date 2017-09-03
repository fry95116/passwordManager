export default {
  namespaced: true,
  state: {
    RPGC_length: 8,
    RPGC_charsets: ['upperCase', 'lowerCase', 'number'],
    keygen: '',
    duration: 30
  },
  mutations: {
    update(state, {attr, newValue}){
      let test = false
      switch(attr){
        case 'RPGC_length':
        case 'duration': test = /^\d+$/.test(newValue); break
        default: test = true
      }
      if(test) state[attr] = newValue
    }
  }
}