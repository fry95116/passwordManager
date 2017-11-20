let { screenWidth } = wx.getSystemInfoSync()

export function px2rpx(px) {
  return Math.round(px * 750 / screenWidth)
}

export function rpx2px(rpx) {
  return Math.round(rpx * screenWidth / 750)
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

// 字符串转为ArrayBuffer对象，参数为字符串
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function strToBase64(str) {
  return wx.arrayBufferToBase64(str2ab(str))
}

export function base64ToStr(str) {
  return ab2str(wx.base64ToArrayBuffer(str))
}

export function isNil(o) {
  return o == null
}

export function isNotNil(o) {
  return !isNil(o)
}

export function isNull(o) {
  return o === null
}

export function isNotNull(o) {
  return !isNull(o)
}

export function isUndefined(o) {
  return o === undefined
}

export function isNotUndefined(o) {
  return !isUndefined()
}

export function map(obj, iter) {
  let res = {}
  for (let key in obj) res[key] = iter(obj[key])
  return res
}

export function getStorage(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key,
      success: resolve,
      fail: reject
    })
  })
}

export function scanCode(opt) {
  return new Promise((resolve, reject) => {
    wx.scanCode({
      ...opt,
      success: resolve,
      fail: reject
    })
  })
}