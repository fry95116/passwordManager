
var global_listeners = {

}

exports.bind = function(eventID, handler){
    if(typeof eventID !== 'string') throw new Error('eventID required')
    if(typeof handler !== 'function') throw new Error('handler required')
    
    if(!(eventID in global_listeners)){
        global_listeners[eventID] = []
    }
    
    global_listeners[eventID].push({
        registor: this,
        handler: handler
    })
}

exports.unbind = function(eventID, handler){
    if(typeof eventID !== 'string') throw new Error('eventID required')
    if(typeof handler !== 'function') throw new Error('handler required')

    if(eventID in global_listeners){
        for(var i = 0; i < global_listeners[eventID].length; ++i){
            if(global_listeners[eventID][i].handler === handler) global_listeners[eventID].splice(i, 1)
        }
    }
}

exports.emit = function(eventID) {
    if(typeof arguments === 'undefined') throw new Error('eventID required')
    //取出传递给事件的参数
    var args = []
    for(var i = 1; i < arguments.length; ++i){
        args.push(arguments[i])
    }

    if(eventID in global_listeners){
        for (var listener of global_listeners[eventID]){
            listener.handler.apply(listener.registor, args)
        }
    }
}