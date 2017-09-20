import util from './util.js';


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
    init(){
    let app=  new util.Three(this.$el,this.width,this.height);
        app.updateAssets( this.loadData );
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
  },

  mounted(){
   this.init()
  }

}
