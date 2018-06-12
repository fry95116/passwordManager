var passwordBooks = {
    name: 'passwordBooks',
    template:`
        <section id="passwordBooks" class="major-function" style="display:block;">

            <div class="title-bar">
                <h1 class="title-main">{{ title }}</h1>
            </div>
            <ul id="list-passwordBooks">
                <li>
                    <h2 class="name">PassBook1</h2>
                    <div class="content">
                        <div class="overlap">
                            <div class="icon-bg">
                                <img class="icon" src="img/icon-locked.svg">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <h2 class="name">PassBook2</h2>
                    <div class="content">
                        <div class="overlap">
                            <div class="icon-bg">
                                <img class="icon" src="img/icon-locked.svg">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <h2 class="name">PassBook2</h2>
                    <div class="content">
                        <div class="overlap">
                            <div class="icon-bg">
                                <img class="icon" src="img/icon-locked.svg">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <h2 class="name">PassBook2</h2>
                    <div class="content">
                        <div class="overlap">
                            <div class="icon-bg">
                                <img class="icon" src="img/icon-locked.svg">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <h2 class="name">PassBook2</h2>
                    <div class="content">
                        <div class="overlap">
                            <div class="icon-bg">
                                <img class="icon" src="img/icon-locked.svg">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
    `,
    data(){
        return{
            title: 'PasswordBooks'
        }
    },

    activated(){

        this.$emit('setTitle', this.title)
        this.$emit('setActionBar', null, {text: 'Settings'})
        this.$emit('setToolBar',[
            {
                icon: './img/newPasswordBook.svg',
                callback: ()=>{
                    this.$emit('route', 'newPasswordBook')
                }
            },
            {icon: './img/edit.svg'}
        ])
    }
}

module.exports = passwordBooks