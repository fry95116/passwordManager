var RSAKey = require('../../libs/rsa')
var passwordBooks = require('../../models/passwordBooks')
var toolBar = require('../toolBar')

var passwordBook = {
    template:`
        <li>
            <div class="header">
                <h2 class="name">{{name}}</h2>
            </div>
            <div class="content" v-bind:style="{height: currentHeight + 'px'}">
                <transition 
                    name="fade"
                    v-on:before-leave="beforeUnlock"
                    v-on:before-enter="beforeLock"
                >
                    <div v-if="encrypted" class="overlap" @click="$emit('decrypt', name)">
                        <div class="icon-bg">
                            <img class="icon" src="img/icon-locked.svg">
                        </div>
                    </div>
                </transition>
                <ul v-if="!encrypted" class="pages_brief">
                    <li v-for="(item, key) in pages_brief">
                        <div class="name">{{key}}</div> 
                        <div class="primary-info">{{item.primaryInfo}}</div>
                    </li>
                </ul>
            </div>
        </li>
    `,
    data(){
        return {
            currentHeight: 117
        }
    },
    props:{
        name: {
            type: String,
            required: true
        },
        privateKey:{
            type: RSAKey
        }
    },
    computed:{
        encrypted(){
            return this.privateKey == null
        },
        pages_brief(){
            if(this.encrypted) return null
            else {
                var key = this.privateKey
                var ret = {}
                var pages = passwordBooks.data[this.name].pages
                for (name in pages){
                    ret[name] = JSON.parse(key.decrypt(pages[name]))
                }
                return ret
            }
            // else return {
            //     test1: 123456,
            //     adbtest2: 654321,
            //     tedst3: 'abcdef',
            //     test12: 123456,
            //     adbtest22: 654321,
            //     tedst32: 'abcdef',
            //     test13: 123456,
            //     adbtest23: 654321,
            //     tedst33: 'abcdef'
            // }
        }
    },
    methods:{
        beforeUnlock(){
            this.currentHeight = Math.max(this.$el.querySelector('ul').offsetHeight, 117)
        },
        beforeLock(){
            this.currentHeight = 117
        }
    }
}

module.exports = passwordBook