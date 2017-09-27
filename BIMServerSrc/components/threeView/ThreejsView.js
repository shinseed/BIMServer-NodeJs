import util from './util.js';
import Toolbar from './toolbar'
/**
 * initThree - 初始化three
 *
 * @param  {type} canvas   description
 * @param  {type} width    description
 * @param  {type} height   description
 * @param  {type} loadData description
 * @return {type}          description
 */
function initThree(canvas,width,height,vue) {
  let app=  new util.Three(canvas,width,height,vue);
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
     height:this.wh.height,
     menuEnable:false,
     loadText:'',
     menuType:'success',
     follow:{
       btnCss:'primary',
       iconCss:'circle-check',
       isFollow:true
     }

   }
 },
   render(h){
     return (
       <Toolbar width={this.width} loadText={this.loadText}/>
      )
  },
  methods:{
    handProcess(text){
      this.loadText=text;
    },
    VisibleSelectModels(){
      this.app.interfaceVisbileSelects();
    },
    ShowSelectModels(){
      this.app.interfaceShowModels();
    },
    ResetCamera(){
      this.app.controls.reset();
    },
    EnableFollow(){

      this.app.interfaceEnableFollow();
    }

  },
  mounted(){
  let app=  initThree(this.$el.getElementsByTagName('canvas')[0],this.width,this.height,this);
  this.app=app;
  console.log(this.app,12112121);
    this.$emit('listerThree',app)
  }

}
