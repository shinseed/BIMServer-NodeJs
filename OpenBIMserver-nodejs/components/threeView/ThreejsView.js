import util from './util.js';


export default{
  name:'vue-threejs-view',
  data(){
   return {
     width:400,
     height:400
   }
 },
   render(h){
     return (<canvas></canvas>);
  },
  methods:{
    init(){
      new util.Three(this.$el,this.width,this.height);
    }
  },

  mounted(){
   this.init()
  }

}
