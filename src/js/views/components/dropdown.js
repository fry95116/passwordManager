var dropDown = {
    template: `
        <div class="dropdown">
            <input type="text" 
                v-bind:placeholder="placeholder"
                v-bind:value="value_selected"
                @click="selecting = true"
                @blur="selecting = false"
                v-bind:readonly="!editable" 
            >
            <span class="caret"></span>
            <div v-if="selecting" class="options-wrapper">
                <ul class="options">
                    <li v-for="(value, key) in options"
                        v-bind:class="{selected: key === key_selected}"
                        @click="select(key)"
                    >
                        {{value}}
                    </li>
                </ul>
            </div>
        </div>
    `,
    data(){
        return{
            selecting: false,
        }
    },
    computed:{
        value_selected(){
            if(this.key_selected in this.options){
                return this.options[this.key_selected]
            }
            else return ''
        }
    },
    model:{
        prop: 'key_selected',
        event: 'select'
    },
    props:{
        editable: {
            type:Boolean,
            default: false
        },   
        placeholder:{
            type: String,
            default: ''
        },
        options: {
            type: Object,
            required: true
        },
        key_selected: {
            type: String,
            default: ''
        }
    },
    methods:{
        select(key){
            this.$emit('select', key)
        }
    }
}

module.exports = dropDown