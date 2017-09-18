var THREE = require('three');
import {TrackballControls} from './TrackballControls'


class Three {
  constructor(id,w,h) {
    this.canvas=document.getElementById(id);
    this.camera=null;
    this.controls=null;
    this.scene=null;
    this.renderer=null;
    this.width=w;
    this.height=h;
    this.init();
    this.animate();
  }
  init(){
    this.camera = new THREE.PerspectiveCamera( 60, this.width / this.height, 1, 1000 );
  				this.camera.position.z = 500;

  				// world
  				this.scene = new THREE.Scene();
  				this.scene.background = new THREE.Color( 0xcccccc );
  				this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
  				var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
  				var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
  				for ( var i = 0; i < 500; i ++ ) {
  					var mesh = new THREE.Mesh( geometry, material );
  					mesh.position.x = ( Math.random() - 0.5 ) * 1000;
  					mesh.position.y = ( Math.random() - 0.5 ) * 1000;
  					mesh.position.z = ( Math.random() - 0.5 ) * 1000;
  					mesh.updateMatrix();
  					mesh.matrixAutoUpdate = false;
  					this.scene.add( mesh );
  				}
  				// lights
  				var light = new THREE.DirectionalLight( 0xffffff );
  				light.position.set( 1, 1, 1 );
  				this.scene.add( light );
  				var light = new THREE.DirectionalLight( 0x002288 );
  				light.position.set( -1, -1, -1 );
  				this.scene.add( light );
  				var light = new THREE.AmbientLight( 0x222222 );
  				this.scene.add( light );
  				// renderer
  				this.renderer = new THREE.WebGLRenderer( { antialias: false,canvas:this.canvas } );
  				// this.renderer.setPixelRatio( window.devicePixelRatio );
  				this.renderer.setSize( this.width, this.height );
  				// this.container = document.getElementById( 'container' );
  				// this.container.appendChild( renderer.domElement );
  				// this.container.appendChild( stats.dom );
  				//
  				//
          this.controls = new THREE.TrackballControls( this.camera,this.canvas );
          // this.controls.rotateSpeed = 1.0;
          // this.controls.zoomSpeed = 1.2;
          // this.controls.panSpeed = 0.8;
          // // this.controls.noZoom = false;
          // // this.controls.noPan = false;
          // this.controls.staticMoving = true;
          // this.controls.dynamicDampingFactor = 0.3;
          // this.controls.keys = [ 65, 83, 68 ];
          this.controls.addEventListener( 'change', this.render.bind(this) );
  				this.render();
  }

  animate(){
				requestAnimationFrame(()=>{
          this.animate()
        });
				this.controls.update();
	}

  render() {
				this.renderer.render( this.scene, this.camera );
	}
}

export default{
  Three
}
