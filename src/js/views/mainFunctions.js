var Vue = require('vue')
var isArray = require('lodash.isarray')
var findIndex = require('lodash.findindex')

var actionBar = require('./actionBar')
var toolBar = require('./toolBar')
var passwordBooks = require('./components/passwordBooks')
var newPasswordBook = require('./components/newPasswordBook')
var newPage = require('./components/newPage')

var components = {
    passwordBooks,
    newPasswordBook,
    newPage
}

var mainFunctions = new Vue({
    el: '#major-functions',
    template: `
        <div id="major-functions" @scroll="toggleTitleIfNecessary">
            <transition v-bind:name="transitionName">
                <component v-bind:is="currentFrame"
                    v-bind:params = "currentParams"
                    @setActionBar="setActionBar"
                    @setToolBar="setToolBar"
                    @route="routeTo">
                </component>
            </transition>

        </div>
    `,
    data:{
        currentIndex: 0,
        currentParams: null,
        frameNames: Object.keys(components),
        transitionName:'',
        transitions:{
            default:'fade',
            'passwordBooks-newPasswordBook':'slide-leftIn',
            'newPasswordBook-passwordBooks':'slide-rightIn',
        }
    },
    computed:{
        currentFrame(){
            return this.frameNames[this.currentIndex]
        }
    },
    methods:{
        toggleTitleIfNecessary(){
                actionBar.showTitle = this.$el.scrollTop > 47
        },

        setActionBar(option){
            actionBar.title = option.title || ''
            actionBar.button_left = option.button_left || null
            actionBar.button_right = option.button_right || null
        },

        setToolBar(buttons){
            if(isArray(buttons) && buttons.length > 0){
                toolBar.buttons = buttons
                toolBar.visiable = true
            }
            else{
                toolBar.visiable = false
            }
        },
        
        routeTo(frameName, params){
            if(params) this.currentParams = params
            else this.currentParams = null

            var idx = findIndex(this.frameNames, (name)=> name === frameName)
            if(idx === -1) return

            if(this.transitions[this.currentFrame + '-' + frameName]){
                this.transitionName = this.transitions[this.currentFrame + '-' + frameName]
            }
            else if(this.transitions['default']){
                this.transitionName = this.transitions['default']
            }
            else{
                this.transitionName = ''
            }
            this.currentIndex = idx
        }
    },
    components:components
})



module.exports = mainFunctions