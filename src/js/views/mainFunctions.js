var Vue = require('vue')
var isArray = require('lodash.isarray')
var findIndex = require('lodash.findindex')

var actionBar = require('./actionBar')
var toolBar = require('./toolBar')
var passwordBooks = require('./components/passwordBooks')
var newPasswordBook = require('./components/newPasswordBook')

var components = {
    passwordBooks,
    newPasswordBook
}

var mainFunctions = new Vue({
    el: '#major-functions',
    template: `
        <div id="major-functions" @scroll="toggleTitleIfNecessary">
            <transition v-bind:name="transitionName">
                <keep-alive>
                    <component v-bind:is="currentFrame" 
                        @setTitle="setTitle"
                        @setActionBar="setActionBar" 
                        @setToolBar="setToolBar"
                        @route="routeTo">
                    </component>
                </keep-alive>
            </transition>

        </div>
    `,
    data:{
        currentIndex: 0,
        currentTitle: '',
        frameNames: Object.keys(components),
        transitionName:'',
        transitions:{
            default:'slide-leftIn',
            'newPasswordBook-passwordBooks':'slide-rightIn'
        }
    },
    computed:{
        currentFrame(){
            return this.frameNames[this.currentIndex]
        }
    },
    methods:{
        toggleTitleIfNecessary(){
            if(this.$el.scrollTop > 47)
                actionBar.title = this.currentTitle
            else
                actionBar.title = ''
        },

        setTitle(title){
            this.currentTitle = title
        },

        setActionBar(button_left, button_right){
            actionBar.button_left = button_left || null
            actionBar.button_right = button_right || null
            // console.log('test')
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
        routeTo(frameName){
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