var THREE = require('three'); //threejs不用import方式 是不想webpack 出打包警告提示
import { TrackballControls } from './TrackballControls';
import { WWOBJLoader2 } from './WWOBJLoader2';
import { Octree } from './Octree';
// var dat=require('dat.gui');
// console.log(dat);

var ZipTools = (function() {

    function ZipTools(path) {
        this.zip = new JSZip();

        this.fileLoader = new THREE.FileLoader();
        this.fileLoader.setPath(path);
        this.fileLoader.setResponseType('arraybuffer');

        this.zipContent = null;
    }

    ZipTools.prototype.load = function(filename, callbacks) {
        var scope = this;

        var onSuccess = function(zipDataFromFileLoader) {
            scope.zip.loadAsync(zipDataFromFileLoader)
                .then(function(zip) {

                    scope.zipContent = zip;
                    callbacks.success();

                });
        };

        var refPercentComplete = 0;
        var percentComplete = 0;
        var output;
        var onProgress = function(event) {
            if (!event.lengthComputable) return;

            percentComplete = Math.round(event.loaded / event.total * 100);
            if (percentComplete > refPercentComplete) {

                refPercentComplete = percentComplete;
                output = 'Download of "' + filename + '": ' + percentComplete + '%';
                console.log(output);
                if (Boolean(callbacks.progress)) callbacks.progress(output);

            }
        };

        var onError = function(event) {
            var output = 'Error of type "' + event.type + '" occurred when trying to load: ' + filename;
            console.error(output);
            callbacks.error(output);
        };

        console.log('Starting download: ' + filename);
        this.fileLoader.load(filename, onSuccess, onProgress, onError);
    };

    ZipTools.prototype.unpackAsUint8Array = function(filename, callback) {

        if (JSZip.support.uint8array) {

            this.zipContent.file(filename).async('uint8array')
                .then(function(dataAsUint8Array) {

                    callback(dataAsUint8Array);

                });

        } else {

            this.zipContent.file(filename).async('base64')
                .then(function(data64) {

                    callback(new TextEncoder('utf-8').encode(data64));

                });

        }
    };

    ZipTools.prototype.unpackAsString = function(filename, callback) {
        this.zipContent.file(filename).async('string')
            .then(function(dataAsString) {

                callback(dataAsString);

            });
    };

    return ZipTools;

})();

/**
 * threeview class
 * @class
 */
class Three {
    constructor(canvas, w, h) {
        //基础属性
        this.canvas = canvas;
        this.camera = null;
        this.controls = null;
        this.scene = null;
        this.width = w;
        this.height = h;
        this.aspectRatio = w / h;
        this.cameraDefaults = {
            posCamera: new THREE.Vector3(0.0, 175.0, 500.0),
            posCameraTarget: new THREE.Vector3(0, 0, 0),
            near: 0.1,
            far: 10000,
            fov: 45
        };
        this.cameraTarget = this.cameraDefaults.posCameraTarget;

        //鼠标点击相关属性
        this.raycaster = null;
        this.mouse = null;
        this.INTERSECTED = [];
        this.selectModels=[];
        this.isShift=false;//是否多选
        this.renderer = null;

        this.mouseMaterialDefault = new THREE.MeshPhongMaterial({
            color: 0xadf1a7,
            specular: 0x009900,
            shininess: 30,
            //  wireframe:true,
            //  wireframeLinewidth:10,
            flatShading: true
        });


        //模型相关
        this.wwObjLoader2 = new WWOBJLoader2();
        this.wwObjLoader2.setCrossOrigin('anonymous');
        this.octree;
        this.loadCounter = 0;
        this.objs2Load = [];
        this.allAssets = [];

        //loading
        this.processing = false;



        this.init();
        // this.animate();
    }
    init() {
        this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
        this.resetCamera();
        // world
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xcccccc);
        // this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

        //坐标轴辅助
        var helper = new THREE.GridHelper(1200, 60, 0xFF4444, 0x404040);
        this.scene.add(helper);
        var axes = new THREE.AxisHelper(500);
        this.scene.add(axes);
        //  this.CameraHelper=new THREE.CameraHelper(this.camera);
        // this.scene.add(this.CameraHelper);

        // light
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        this.scene.add(light);
        // var light = new THREE.DirectionalLight(0x002288);
        // light.position.set(-1, -1, -1);
        // this.scene.add(light);
        var light = new THREE.AmbientLight(0x222222);
        this.scene.add(light);

        // create octree
        this.octree = new Octree({
            // when undeferred = true, objects are inserted immediately
            // instead of being deferred until next octree.update() call
            // this may decrease performance as it forces a matrix update
            undeferred: false,
            // set the max depth of tree
            depthMax: Infinity,
            // max number of objects before nodes split or merge
            objectsThreshold: 8,
            // percent between 0 and 1 that nodes will overlap each other
            // helps insert objects that lie over more than one node
            overlapPct: 0.15

            // pass the scene to visualize the octree
        });

        //鼠标移动相关操作
        var geometry = new THREE.CylinderGeometry( 0, 20, 100, 3 );
        geometry.translate ( 0, -50, 0 );
				geometry.scale( 0.2, 0.2, 0.2 );
				geometry.rotateX( -Math.PI / 2 );
				this.helper = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
        this.helper.visible=false;
				this.scene.add( this.helper );

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        // renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas, autoClear: true });
        // this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(this.width, this.height);
        // this.container = document.getElementById( 'container' );
        // this.container.appendChild( renderer.domElement );
        // this.container.appendChild( stats.dom );
        //
        //
        this.controls = new THREE.TrackballControls(this.camera, this.canvas);

        // this.render();

    }
    /**
     * canvasHandleClick - 模型点击事件
     *
     * @param  {type} event description
     * @return {type}       description
     */
    canvasHandleClick(event) {
        event.preventDefault();
        //canvas坐标-webgl坐标
        let x = (event.offsetX / this.canvas.width) * 2 - 1;
        let y = -(event.offsetY / this.canvas.height) * 2 + 1;
        this.mouse.x = x;
        this.mouse.y = y;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        let meshesSearch = this.octree.search(this.raycaster.ray.origin, this.raycaster.ray.far, true, this.raycaster.ray.direction);
        // let intersections = this.raycaster.intersectObjects( this.objs2Load[0].pivot.children );
        let intersections = this.raycaster.intersectOctreeObjects(meshesSearch);
        //
        if (intersections.length > 0) {
            intersections.sort((a, b) => {
                return a.distance - b.distance;
            });
          console.log(intersections[0]);
            if(this.isShift){
              for(let item of this.selectModels){
                if(item==intersections[0].object){
                  return;
                }
              }
                intersections[0].object.currenMaterial=  intersections[0].object.material;
                intersections[0].object.material=this.mouseMaterialDefault;
                this.selectModels.push(intersections[0].object);

            }else{
              this.selectModels.forEach((item)=>{
                item.material=item.currenMaterial;
              });
              this.selectModels=[];
              intersections[0].object.currenMaterial=  intersections[0].object.material;
              intersections[0].object.material=this.mouseMaterialDefault;
              this.selectModels.push(intersections[0].object);
            }
        } else {
            this.selectModels.forEach((item,index)=>{
              item.material=item.currenMaterial;
              // console.log(index);
            })
            this.selectModels=[];
        }
        // console.log(intersections);

    }
    canvasHandleMousemove(event) {
        event.preventDefault();
        let x = (event.offsetX / this.canvas.width) * 2 - 1;
        let y = -(event.offsetY / this.canvas.height) * 2 + 1;
        this.mouse.x = x;
        this.mouse.y = y;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        let meshesSearch = this.octree.search(this.raycaster.ray.origin, this.raycaster.ray.far, true, this.raycaster.ray.direction);
        let intersections = this.raycaster.intersectOctreeObjects(meshesSearch);

        if (intersections.length > 0) {
            intersections.sort((a, b) => {
                return a.distance - b.distance;
            });
            var p = intersections[0].point;
            var n = intersections[0].face.normal.clone();
            n.transformDirection( intersections[0].object.matrixWorld );
            n.multiplyScalar(10);
            n.add(intersections[0].point);
            this.helper.visible=true;
            this.helper.lookAt(n);
            this.helper.position.copy(p);
        } else {
            this.helper.visible=false;
        }

    }
    resetCamera() {
        this.camera.position.copy(this.cameraDefaults.posCamera);
        this.cameraTarget.copy(this.cameraDefaults.posCameraTarget);
        this.updateCamera();
    }
    updateCamera() {
        this.camera.aspect = this.aspectRatio;
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    }
    initPostGL() {
        var scope = this;

        var reloadAssetsProxy = function() {
            scope.reloadAssets();
        };
        var materialsLoaded = function(materials) {
            var count = Boolean(materials) ? materials.length : 0;
            console.log('Loaded #' + count + ' materials.');
        };
        var meshLoaded = (meshName, bufferGeometry, materials) => {
            // just for demonstration...

        };
        var errorWhileLoading = function() {
            // just for demonstration...
        };
        this.wwObjLoader2.registerCallbackMaterialsLoaded(materialsLoaded);
        this.wwObjLoader2.registerCallbackMeshLoaded(meshLoaded);
        this.wwObjLoader2.registerCallbackCompletedLoading(reloadAssetsProxy);
        this.wwObjLoader2.registerCallbackProgress(this.reportProgress);
        this.wwObjLoader2.registerCallbackErrorWhileLoading(errorWhileLoading);

        this.reloadAssets();

        return true;
    }
    recalcAspectRatio() {
        this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
    }
    resizeDisplayGL() {
        this.controls.handleResize();

        this.recalcAspectRatio();
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);

        this.updateCamera();
    }
    clearAllAssests() {
        var ref;
        var scope = this;

        for (var asset in this.allAssets) {
            ref = this.allAssets[asset];

            var remover = function(object3d) {

                if (object3d === ref.pivot) return;

                console.log('Removing ' + object3d.name);
                scope.scene.remove(object3d);

                if (object3d.hasOwnProperty('geometry')) object3d.geometry.dispose();
                if (object3d.hasOwnProperty('material')) {

                    var mat = object3d.material;
                    if (mat.hasOwnProperty('materials')) {

                        var materials = mat.materials;
                        for (var name in materials) {

                            if (materials.hasOwnProperty(name)) materials[name].dispose();

                        }
                    }
                }
                if (object3d.hasOwnProperty('texture')) object3d.texture.dispose();
            };
            scope.scene.remove(ref.pivot);
            ref.pivot.traverse(remover);
            ref.pivot = null;
        }
        this.loadCounter = 0;
        this.allAssets = [];
    }
    updateAssets(objs) {
        this.objs2Load = [];
        this.loadCounter = 0;
        this.processing = true;
        if (Boolean(objs)) {

            var obj2Load;
            var pivot;
            var errors = '';

            for (var i = 0; i < objs.length; i++) {

                obj2Load = objs[i];
                if (!this.allAssets.hasOwnProperty(obj2Load.name)) {

                    pivot = new THREE.Object3D();
                    pivot.position.set(obj2Load.pos.x, obj2Load.pos.y, obj2Load.pos.z);
                    pivot.scale.set(obj2Load.scale, obj2Load.scale, obj2Load.scale);
                    pivot.name = obj2Load.name;
                    let radian=Math.PI/180*obj2Load.rotate.angle;
                    let axis=new THREE.Vector3(obj2Load.rotate.x,obj2Load.rotate.y,obj2Load.rotate.z);

                    pivot.rotateOnAxis(axis,radian);
                    obj2Load.pivot = pivot;
                    this.objs2Load.push(obj2Load);
                    this.allAssets[obj2Load.name] = obj2Load;

                } else {

                    errors += obj2Load.name + ' ';

                }

                if (errors !== '') {
                    this.reportProgress('Will not reload: ' + errors);
                }

            }

        }
    }
    reportProgress(text) {
        document.getElementById('feedback').innerHTML = text;
    }
    reloadAssets() {
        var scope = this;

        if (scope.loadCounter < scope.objs2Load.length) {

            var obj2Load = scope.objs2Load[scope.loadCounter];
            var prepData;
            scope.loadCounter++;


            scope.scene.add(obj2Load.pivot);

            if (Boolean(obj2Load.fileZip)) {

                var zipTools = new ZipTools(obj2Load.pathBase);
                var mtlAsString = null;

                var setObjAsArrayBuffer = function(data) {
                    scope.reportProgress('');
                    prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataArrayBuffer(
                        obj2Load.name, data, obj2Load.pathTexture, mtlAsString
                    );
                    prepData.setSceneGraphBaseNode(obj2Load.pivot);
                    scope.wwObjLoader2.prepareRun(prepData);
                    scope.wwObjLoader2.run();
                };

                var setMtlAsString = function(data) {
                    mtlAsString = data;
                    scope.reportProgress('Unzipping: ' + obj2Load.fileObj);
                    zipTools.unpackAsUint8Array(obj2Load.fileObj, setObjAsArrayBuffer);
                };

                var doneUnzipping = function() {
                    if (Boolean(obj2Load.fileMtl)) {

                        zipTools.unpackAsString(obj2Load.fileMtl, setMtlAsString);

                    } else {

                        setMtlAsString(null);

                    }
                };

                var errorCase = function(text) {
                    scope.reportProgress(text);
                    scope.processing = false;
                };
                zipTools.load(obj2Load.fileZip, { success: doneUnzipping, progress: scope.reportProgress, error: errorCase });

            } else {

                scope.reportProgress('');
                prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
                    obj2Load.name, obj2Load.pathBase, obj2Load.fileObj, obj2Load.pathTexture, obj2Load.fileMtl
                );
                prepData.setSceneGraphBaseNode(obj2Load.pivot);
                scope.wwObjLoader2.prepareRun(prepData);
                scope.wwObjLoader2.run();

            }
        } else { //当所有模型加载完毕后填充 octree
            this.objs2Load.forEach((item) => {
                item.pivot.children.forEach((child) => {
                    this.octree.add(child);
                    // this.meshs.push(child);
                })
            })
            //监听事件
            this.canvas.addEventListener('click', this.canvasHandleClick.bind(this), false);
            this.canvas.addEventListener('mousemove', this.canvasHandleMousemove.bind(this), false);
            window.addEventListener('keydown',this.canvasHadnleKeydown.bind(this),false);
            window.addEventListener('keyup',this.canvasHadnleKeyup.bind(this),false);
            scope.processing = false;

        }
    }
    canvasHadnleKeydown(event){
      var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==16){ // 按 shift
                this.isShift=true;
            }
    }
    canvasHadnleKeyup(event){
      var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==16){ // 按 shift
              this.isShift=false
      }
    }
    interfaceVisbileSelects(){
      this.selectModels.forEach((item)=>{
        item.visible=false;
      })
    }
    render() {
        if (!this.renderer.autoClear) this.renderer.clear();

        this.controls.update();

        // this.CameraHelper.update();

        this.octree.update();

        this.renderer.render(this.scene, this.camera);
    }
}

export default {
    Three
}
