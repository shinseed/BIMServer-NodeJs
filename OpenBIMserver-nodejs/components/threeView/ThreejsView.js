import util from './util.js';


export default{
  name:'vue-threejs-view',
  render(h){
    return(
      <div>
        <canvas id={this.canvas_id}></canvas>
      </div>
    )
  },
   data(){
    return {
      canvas_id:`canvas_id${new Date().getDate()}`,
      width:400,
      height:400
    }
  },
  methods:{
    init(){
      new util.Three(this.canvas_id,this.width,this.height);
    }
  },

  mounted(){
   this.init()
  }

}
