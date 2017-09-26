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
     menuType:'success'
   }
 },
   render(h){
     return (<div>
              <div style={{position:'fixed','text-align':'left',width:this.width+'px',display:'inline-flex'}}>
                  <el-button type={this.menuType} onClick={this.handleMenuClick}  icon="menu" size="mini"></el-button>
                  <div v-show={this.menuEnable} >
                    ---
                    <el-button type="primary" icon="star-off" size="mini"></el-button>
                    <el-button type="primary" icon="star-on" size="mini"></el-button>
                    <el-button type="primary" icon="edit" size="mini"></el-button>
                  </div>
              </div>
              <div style={{position:'fixed','text-align':'center',width:`${this.width}px`}}>
              <span>{this.loadText}</span>
              </div>

              <canvas></canvas>

            </div>);
  },
  methods:{
    handleMenuClick(){
      this.menuEnable=!this.menuEnable;
      this.menuEnable?this.menuType='':this.menuType='success';
    },
    handProcess(text){
      this.loadText=text;
    }
  },
  mounted(){
  let app=  initThree(this.$el.getElementsByTagName('canvas')[0],this.width,this.height,this);
    this.$emit('listerThree',app)
  }

}
