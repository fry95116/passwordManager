(function () {
    /** 检查`test`是否不为undefined或者null 
     * @param {any} test - 被测试的对象
     * @return {boolean} - 测试结果
     */
    function isNotNil(test) {
        return !(test == null)
    }
    exports.isNotNil = isNotNil

    /**
     * 每隔`timeStep`ms检查一次condition
     * 直到`condition() === true`或者超时
     * @param {function} condition - 检查条件，当`condition() === true`时继续执行
     * @param {integer} timeout - 超时时间，当等待时间超出时抛出异常(单位:ms)
     * @param {integer} timeStep - 检查时间间隔(单位:ms)
     */
    async function waitUntil(condition, timeout = 30000, timeStep = 100) {
        
        if (timeout < 0) throw new Error('timeout most be a postion integer')
        if (timeStep < 0) throw new Error('timeStep most be a postion integer')

        var startTime = new Date().getTime()
        while(new Date().getTime() - startTime < timeout){
            await sleep(timeStep)
            if (condition()) return
        }

        throw new Error('time out')

    }
    exports.waitUntil = waitUntil

    /**
     * 暂停ms毫秒继续执行
     * @param {integer} ms - 暂停时间（单位:ms）
     */
    function sleep(ms){
        return new Promise(function(resolve){
            setTimeout(resolve, ms)
        })
    }
    exports.sleep = sleep

    /** 
     * 获取MediaDevices接口，
     * @return {MediaDevices | null} - 如果浏览器支持则返回MedieDevices接口，否则返回null 
     */
    function getMediaDevices() {
        var res = null

        if (isNotNil(navigator)) {
            if (isNotNil(navigator.mediaDevices) && isMediaDevices(navigator.mediaDevices)) {
                res = navigator.mediaDevices
            }
            else if (isMediaDevices(navigator)) {
                res = navigator
            }
            else if (isNotNil(navigator.webkitEnumerateDevices) && isNotNil(navigator.webkitGetUserMedia)) {
                navigator.enumerateDevices = navigator.webkitEnumerateDevices
                navigator.getUserMedia = navigator.webkitGetUserMedia
                res = navigator
            }
        }

        else if (isNotNil(MediaDevices) && isMediaDevices(MediaDevices)) {
            res = MediaDevices
        }
        return res
    }
    exports.getMediaDevices = getMediaDevices

    /** 检查`test`是否实现了MediaDevices接口 
     * @param {any} test - 被测试的对象
     * @return {boolean} - 测试结果
     */
    function isMediaDevices(test) {
        return isNotNil(test.getUserMedia)
    }
    exports.isMediaDevices = isMediaDevices

    function castFileToDataUrl(file){
        return new Promise(function(resolve, reject){
            var fileReader = new FileReader()
            fileReader.onload = function(){
                resolve(this.result)
            }
            fileReader.readAsDataURL(file)
        })
    }
    exports.castFileToDataUrl = castFileToDataUrl
    
    function castDataUrlToImage(dataUrl){
        return new Promise(function(resolve, reject){
            var ret = new Image()
            ret.onload = function(){
                resolve(ret)
            }
            ret.onerror = reject
            ret.src = dataUrl
        })
    }
    exports.castDataUrlToImage = castDataUrlToImage

})()