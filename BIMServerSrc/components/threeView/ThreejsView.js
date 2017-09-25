import util from './util.js';

/**
 * initThree - 初始化three
 *
 * @param  {type} canvas   description
 * @param  {type} width    description
 * @param  {type} height   description
 * @param  {type} loadData description
 * @return {type}          description
 */
function initThree(canvas,width,height) {
  let app=  new util.Three(canvas,width,height);
      // app.updateAssets(data);
      app.resizeDisplayGL();
      app.initPostGL();

  let render = function () {
      requestAnimationFrame( render );
      app.render();
    };
  let resizeWindow = function () {
      app.resizeDisplayGL();
    };
    render();
  window.addEventListener( 'resize', resizeWindow, false );
  return app;
}

export default{
  name:'vue-threejs-view',
  props:{
    wh: Object
  },
  data(){
   return {
     width:this.wh.width,
     height:this.wh.height
   }
 },
   render(h){
     return (<canvas></canvas>);
  },
  methods:{
  },
  mounted(){

  let app=  initThree(this.$el,this.width,this.height);
    this.$emit('listerThree',app)
  }

}
