{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `            
        <h1>新建歌曲</h1>
        <form class="form">
            <div class="row">
                <label>
                    歌名
                    <input name="name" type="text" value="__name__">
                </label>
            </div>
            <div class="row">
                <label>
                    歌手
                    <input name="singer" type="text" value="__singer__">
                </label>
            </div>
            <div class="row">
                <label>
                    外链
                    <input name="url" type="text" value="__url__">
                </label>
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data = {}) { // ES6语法：  如果用户没有传data，那么我们就默认执行data={}
            let placeholders = ['name', 'url','singer','id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: ''
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong)=>{
                // let id = newSong.id
                // let attributes = newSong.attributes
                let {id,attributes} = newSong  // ES6 解构赋值，等同于上面两行注释
                // this.data.id = id
                // this.data.name = attributes.name
                // this.data.singer = attributes.singer
                // this.data.url = attributes.url
                Object.assign(this.data = {id,...attributes}) // ES6语法 等同于上面四行注释
            }, (error)=>{
                console.error(error);
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload', (data) => {
                this.model.data = data
                console.log(data)
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.create(data)
                    .then(()=>{
                        this.view.reset()
                        let string = JSON.stringify(this.model.data)
                        let object = JSON.parse(string)
                        window.eventHub.emit('create',object)
                    })
            })
        }
    }

    controller.init(view, model)
}