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
function initThree(canvas,width,height,loadData) {
  let data=[];
  //解除vue obdata
  loadData.forEach((item)=>{
    const obj = Object.assign({}, item);
    obj.pos=Object.assign({},item.pos);
    data.push(obj);
  });
  let app=  new util.Three(canvas,width,height);
      app.updateAssets(data);
      app.resizeDisplayGL();
      app.initPostGL();
      console.log(app);

  let loadAssets = function ( assets ) {
          if ( ! app.processing ) {
            app.updateAssets( assets );
            app.reloadAssets();
          }
      };
  let render = function () {
      requestAnimationFrame( render );
      app.render();
    };
  let resizeWindow = function () {
      app.resizeDisplayGL();
    };
    render();
  window.addEventListener( 'resize', resizeWindow, false );
}

export default{
  name:'vue-threejs-view',
  props:{
    loadData: Array
  },
  data(){
   return {
     width:1000,
     height:600
   }
 },
   render(h){
     return (<canvas></canvas>);
  },
  methods:{
  },
  mounted(){
    initThree(this.$el,this.width,this.height,this.loadData);
  }

}
