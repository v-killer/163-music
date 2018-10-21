{
    let view = {
        el: 'section.lastestMusic',
        init(){
            this.$el = $(this.el)
        },
        render(data){
                let {songs} = data
                songs.map((song)=>{
                let $li = $(`
                <li>
                    <a href="./song.html?id=1">
                        <h3>${song.name}</h3>
                        <p>${song.singer}</p>
                        <svg class="play">
                            <use xlink:href="#icon-play-circled"></use>
                        </svg>
                    </a>
                </li>
                `)
                this.$el.find('#lastestMusic').append($li)
            })

        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return {
                        id: song.id,
                        ...song.attributes
                    }
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(()=>{
                console.log(1)
                this.view.render(this.model.data)
                console.log(2)
            })
        }
    }
    controller.init(view,model)
}
