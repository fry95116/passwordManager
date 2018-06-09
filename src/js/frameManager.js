class FrameManager{
    constructor(){
        this._frames = {

        }
    }

    registerFrame(url, el){
        //TODO 检查URL格式
        if(/^\/?[A-Za-z0-9_]+(\/[A-Za-z0-9_]+)*\/?$/.test(url) === false) throw new Error('invalid url')
        var tail = url.length - 1
        
        if(url[0] === '/') url = url.substring(1)
        if(url[tail] === '/') url = url.substring(0, tail)

        if(url in this._frames) throw new Error('url exists')
        this._frames[url] = el
    }
}

function getPathList(url){
    if(/^[A-Za-z0-9_]+(\/[A-Za-z0-9_]+)*$/.test(url) === false) throw new Error('invalid url')

    var routes = url.split('/')
    var len = routes.length

    var ret = []
    for(var i = 1; i <= len; ++i){
        ret.push(routes.slice(0, i).join('/'))
    }

    return ret
}