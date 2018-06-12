var Vue = require('vue')
var isFunction = require('lodash.isfunction')

var actionBar = new Vue({
    el: '#action-bar',
    template:`
        <nav id="action-bar" v-show="visiable">
            <button v-if="button_left" class="btn"
                    @click="$_executeCallback_left">
                {{ button_left.text }}
            </button>
            <div v-else class="placeholder"></div>
            <transition name="fade">
                <div v-if="title !== ''" class="title" v-bind:style="{'text-align': titleAlign}">{{ title }}</div>
            </transition>
            <button v-if="button_right" class="btn"
                    @click="$_executeCallback_right">
                {{ button_right.text }}
            </button>
            <div v-else class="placeholder"></div>
        </nav>
    `,
    data:{
        visiable: true,
        title:'',
        button_left: null,
        button_right: null
    },
    
    computed: {
        titleAlign() {
            if(this.button_left){  // 10 11
                if(this.button_right){  // 11
                    return 'center'
                }
                else{  // 10
                    return 'right'
                }
            }
            else{  // 00 01
                if(this.button_right){  // 01
                    return 'left'
                }
                else{  // 00
                    return 'center'
                }
            }
        }
    },

    methods:{
        $_executeCallback_left(){
            if(isFunction(this.button_left.callback)){
                this.button_left.callback()
            }
        },
        $_executeCallback_right(){
            if(isFunction(this.button_right.callback)){
                this.button_right.callback()
            }
        }
    }

})

module.exports = actionBar