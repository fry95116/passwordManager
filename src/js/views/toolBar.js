var Vue = require('vue')
var isFunction = require('lodash.isfunction')

var toolBar = new Vue({
    el: '#tool-bar',
    template: `
        <transition name="fade">
            <div id="tool-bar" v-show="visiable">
                <button v-for="(btn, index) in buttons"
                        v-on:click="$_executeCallback(index)" class="btn">
                    <img v-bind:src="btn.icon">
                </button>
            </div>
        </transition>
    `,
    data:{
        visiable: false,
        buttons: null
    },
    methods:{
        $_executeCallback(index){
            if(isFunction(this.buttons[index].callback)){
                this.buttons[index].callback()
            }
        }
    }
})

module.exports = toolBar