/**
 * Created by lixin on 2017/4/6.
 */
import * as THREE from 'three';
import threeBase from './ThreeBase';
require('../libs/OrbitControls');
require('../libs/PointerLockControls');
var TWEEN = require('tween.js');

/**
 * three控件子类
 */
const createOrbitControl = 'createOrbitControl';
const createResize = 'createResize';
const createRender = 'createRender';
const createSuperMario = 'createSuperMario';
const createControlMethods = 'createControlMethods';
class threeControls extends threeBase {
  constructor(id, state) {
    super(id, state);
    this.clock = new THREE.Clock();
    /**
     * 控件的状态开关
     * @param {boolean} orbitControl --轨道控件
     * @param {boolean} superMarioControl --超级玛丽控件
     */
    this.controlsStatus = {
      orbitControl: true,
      superMarioControl: false
    };
    /**
     * three基础属性集群
     * @type {Object}
     */
    this.attributes = {};
    this.attributes.webglDb = {};

    this.attributes.elementList = [];

    this.attributes.attributeListDiv = {};

    this.attributesEnabled = true;

    this[createSuperMario]();

    this[createOrbitControl]();

    this[createRender]();

    this[createResize]();

    this[createControlMethods]();
  }

  /**
   * 创建轨道视角控制器
   * @param {number} maxDistance --最远视角*/
  [createOrbitControl]() {
    this.orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controlsStatus.orbitControl = true;
    this.orbitControl.maxDistance = 700000;
    this.orbitControl.target.set(0, 100, 0);
  }

  /**
   * three控制器的抽离方法集
   */
  [createControlMethods]() {
    this.SuperMarioStart = () => {
      this.SuperMarioFlyStop();
      this.SuperMarioControl.enabled = true;
      this.controlsStatus.orbitControl = false;
      this.controlsStatus.superMarioControl = true;
      document.body.requestPointerLock = document.body.requestPointerLock ||
        document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
      document.body.requestPointerLock();
    };
    this.SuperMarioStop = () => {
      this.SuperMarioControl.enabled = false;
      this.controlsStatus.orbitControl = true;
      this.controlsStatus.superMarioControl = false;
      document.exitPointerLock = document.exitPointerLock ||
        document.mozExitPointerLock;

      // Attempt to unlock
      document.exitPointerLock();
    };
    this.SuperMarioSavePath = (PathName, PrjId,callBack) => {
      if (this.SuperMarioAttribute.pointslist.length > 1) {
        var request = yunlong.getExtension("webapi");
        var that = this;
        request.WebApi.FlyRouteV3.PostFlyRoute((e) => {
          if (e.Success){
            that.SuperMarioAttribute.pathlist.push({
              NAME: PathName,
              PRJ_STRC_ID: PrjId,
              ROUTE_STOPS: this.SuperMarioAttribute.pointslist
            });
            that.SuperMarioAttribute.pointslist = [];
            alert("保存成功！");
            callBack();
          }
          else{
            alert(e.Message);
          }
        }, {
          NAME: PathName,
          PRJ_STRC_ID: PrjId,
          ROUTE_STOPS: this.SuperMarioAttribute.pointslist
        });
      }
      else{
        alert("请至少保存两个位置节点！");
      }
    };
    this.SuperMarioLoadPath = (PrjId) => {
      var request = yunlong.getExtension("webapi");
      var that = this;
      request.WebApi.FlyRouteV3.GetListByPRJ_STRC_ID((e) => {
        that.SuperMarioAttribute.pathlist = [];
        that.SuperMarioAttribute.pathlist = e.Value;
        // console.log(that.SuperMarioAttribute.pathlist);
      }, PrjId);
    };
  }

  /**
   * 创建超级玛丽控件
   */
  [createSuperMario]() {
    this.SuperMarioFlyStop = () => {
      if (this.SuperMarioAttribute.tweenlist.length>0){
        this.SuperMarioAttribute.tweenlist[0].stop();
      }
    };
    this.SuperMarioFlyPlay = (flyRoute) => {
      // if (index >= this.SuperMarioAttribute.pathlist.length) return;
      if (flyRoute==null || flyRoute.ROUTE_STOPS.length <= 1) return;
      //跳转到初始视角
      this.SuperMarioControl.getObject().position.x = flyRoute.ROUTE_STOPS[0].positionX;
      this.SuperMarioControl.getObject().position.y = flyRoute.ROUTE_STOPS[0].positionY;
      this.SuperMarioControl.getObject().position.z = flyRoute.ROUTE_STOPS[0].positionZ;
      this.SuperMarioControl.getObject().rotation.x = flyRoute.ROUTE_STOPS[0].rotationX;
      this.SuperMarioControl.getObject().rotation.y = flyRoute.ROUTE_STOPS[0].rotationY;
      this.SuperMarioControl.getObject().rotation.z = flyRoute.ROUTE_STOPS[0].rotationZ;
      //视角动画

      var that = this;
      this.SuperMarioFlyStop();
      this.SuperMarioAttribute.tweenlist = [];
      let p = [];
      for (let j = 0; j < flyRoute.ROUTE_STOPS.length; j++) {
        var pathlist = flyRoute.ROUTE_STOPS[j];
        let pathinf = {
          "positionX": pathlist.positionX,
          "positionY": pathlist.positionY,
          "positionZ": pathlist.positionZ,
          "rotationX": pathlist.rotationX,
          "rotationY": pathlist.rotationY,
          "rotationZ": pathlist.rotationZ
        }
        p.push(pathinf);
      }
      for (let j = 0; j < p.length; j++) {
        let tween = new TWEEN.Tween(p[j])
          .to(p[j + 1], 3000)
          .easing(TWEEN.Easing.Linear.None)
          .onUpdate(function () {
            that.SuperMarioControl.getObject().position.x = this.positionX;
            that.SuperMarioControl.getObject().position.y = this.positionY;
            that.SuperMarioControl.getObject().position.z = this.positionZ;
            that.SuperMarioControl.getObject().rotation.x = this.rotationX;
            that.SuperMarioControl.getObject().rotation.y = this.rotationY;
            that.SuperMarioControl.getObject().rotation.z = this.rotationZ;
          })
          .onComplete(function () {
            if (j===p.length-1){
              that.SuperMarioStop();
            }
          });
        // if (j === this.SuperMarioAttribute.pathhislist.length - 1) {
        //   tween.onComplete(() => {
        //     that.SuperMarioAttribute.isplay = false;
        //   })
        // }
        if (this.SuperMarioAttribute.tweenlist.length > 0) {
          this.SuperMarioAttribute.tweenlist[this.SuperMarioAttribute.tweenlist.length - 1].chain(tween);
        }

        this.SuperMarioAttribute.tweenlist.push(tween);
      }
      this.SuperMarioStart();
      this.SuperMarioAttribute.isplay = true;
      this.SuperMarioAttribute.tweenlist[0].start();
    };
    this.SuperMarioAttribute = {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      canJump: false,
      prevTime: performance.now(),
      velocity: new THREE.Vector3(),
      pointslist: [],
      pathlist: [],
      tweenlist: [],
      isplay: false,
      raycaster: new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 1000)//目前只有向下的射线检测碰撞
    };

    this.SuperMarioCamera = new THREE.PerspectiveCamera(45, this.container.innerWidth() / this.container.innerHeight(), 1, 70000);
    this.SuperMarioCamera.position.set(0, 0, 0);
    this.SuperMarioControl = new THREE.PointerLockControls(this.SuperMarioCamera);
    // this.SuperMarioControl.enabled = true;
    this.scene.add(this.SuperMarioControl.getObject());


    let onKeyDown = (event) => {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          this.SuperMarioAttribute.moveForward = true;
          break;
        case 37: // left
        case 65: // a
          this.SuperMarioAttribute.moveLeft = true;
          break;
        case 40: // down
        case 83: // s
          this.SuperMarioAttribute.moveBackward = true;
          break;
        case 39: // right
        case 68: // d
          this.SuperMarioAttribute.moveRight = true;
          break;
        case 32: // space
          if (this.SuperMarioAttribute.canJump === true) this.SuperMarioAttribute.velocity.y += 250;
          this.SuperMarioAttribute.canJump = false;
          break;
        case 81://q保存视角点
          let currentpos = new THREE.Vector3();
          let currentrot = new THREE.Vector3();
          currentpos.x = this.SuperMarioControl.getObject().position.x;
          currentpos.y = this.SuperMarioControl.getObject().position.y;
          currentpos.z = this.SuperMarioControl.getObject().position.z;
          currentrot.x = this.SuperMarioControl.getObject().rotation.x;
          currentrot.y = this.SuperMarioControl.getObject().rotation.y;
          currentrot.z = this.SuperMarioControl.getObject().rotation.z;
          let pathinf = {
            "positionX": currentpos.x,
            "positionY": currentpos.y,
            "positionZ": currentpos.z,
            "rotationX": currentrot.x,
            "rotationY": currentrot.y,
            "rotationZ": currentrot.z
          }
          webgl.SuperMarioAttribute.pointslist.push(pathinf);
          break;
        case 69://e 保存飞行路径
          // var request = yunlong.getExtension("webapi");
          // var that = this;
          // request.WebApi.FlyRouteV3.GetListByPRJ_STRC_ID((e) => {
          //   that.SuperMarioAttribute.pathlist = [];
          //   that.SuperMarioAttribute.pathlist = e.Value;
          //
          //   alert("保存成功！");
          //   console.log(e);
          //   console.log(that.SuperMarioAttribute.pathlist);
          // }, "0b2d0a58-b5b0-4772-a26b-8f4093c247f8");

          if (webgl.SuperMarioAttribute.pointslist.length > 1) {
            // let index = this.SuperMarioAttribute.pathlist.length + 1;
            // this.SuperMarioAttribute.pathlist.push({NAME: "漫游路径" + index, ROUTE_STOPS: this.SuperMarioAttribute.pointslist});
            // this.SuperMarioAttribute.pointslist = [];
            // request.WebApi.FlyRouteV3.PostFlyRoute(()=>{
            //   alert("保存成功！");
            // },{
            //   NAME: "测试路径1",
            //   PRJ_STRC_ID: "0b2d0a58-b5b0-4772-a26b-8f4093c247f8",
            //   ROUTE_STOPS: this.SuperMarioAttribute.pointslist
            // })
            
            console.log(this.state)
            this.state.SuperMarioDialogVisible = true;
            
            this.SuperMarioStop();

          }
          break;

      }
    };

    let
      onKeyUp = (event) => {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
            this.SuperMarioAttribute.moveForward = false;
            break;
          case 37: // left
          case 65: // a
            this.SuperMarioAttribute.moveLeft = false;
            break;
          case 40: // down
          case 83: // s
            this.SuperMarioAttribute.moveBackward = false;
            break;
          case 39: // right
          case 68: // d
            this.SuperMarioAttribute.moveRight = false;
            break;
          case 27: //esc
            this.SuperMarioStop();
            this.SuperMarioAttribute.pointslist=[];
            break;
        }
      };

    document
      .addEventListener(
        'keydown'
        ,
        onKeyDown
        ,
        false
      )
    ;
    document
      .addEventListener(
        'keyup'
        ,
        onKeyUp
        ,
        false
      )
    ;
  }

  /**
   * 创建窗口重置器
   * 更新矩阵与视图窗口
   * @注意: 依赖于 #轨道视角控制器
   * */
  [createResize]() {
    //响应窗口调整
    document.addEventListener('resize', () => {
      this.reSize();
    });
    document.addEventListener('scroll', () => {
      this.reSize();
    });
    this.reSize = () => {
      let width = this.state.webglstyle.width;
      let height = this.state.webglstyle.height - 20;
      this.renderer.setSize(width, height);
      if (this.controlsStatus.orbitControl) {
        this.orbitControl.object.aspet = width / height;
        this.orbitControl.object.updateProjectionMatrix();
      }

    };
  }

  /**
   * 创建渲染器
   * 递归渲染webgl
   * */
  [createRender]() {
    this.render = () => {
      var delta = this.clock.getDelta();
      requestAnimationFrame(this.render); // 执行动画 递归
      if (this.controlsStatus.orbitControl) {//默认为轨道控件
        this.orbitControl.update(delta);
        this.renderer.render(this.scene, this.camera);
      }
      if (this.controlsStatus.superMarioControl) {//超级玛丽模式
        this.SuperMarioAttribute.raycaster.ray.origin.copy(this.SuperMarioControl.getObject().position);
        this.SuperMarioAttribute.raycaster.ray.origin.y -= 0;
        var intersections = this.SuperMarioAttribute.raycaster.intersectObjects(this.attributes.elementList, true);
        var isOnObject = intersections.length > 0;
        var time = performance.now();
        var delta = (time - this.SuperMarioAttribute.prevTime) / 1000;
        this.SuperMarioAttribute.velocity.x -= this.SuperMarioAttribute.velocity.x * 10.0 * delta;
        this.SuperMarioAttribute.velocity.z -= this.SuperMarioAttribute.velocity.z * 10.0 * delta;
        this.SuperMarioAttribute.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        if (this.SuperMarioAttribute.moveForward) this.SuperMarioAttribute.velocity.z -= 400.0 * delta;
        if (this.SuperMarioAttribute.moveBackward) this.SuperMarioAttribute.velocity.z += 400.0 * delta;
        if (this.SuperMarioAttribute.moveLeft) this.SuperMarioAttribute.velocity.x -= 400.0 * delta;
        if (this.SuperMarioAttribute.moveRight) this.SuperMarioAttribute.velocity.x += 400.0 * delta;

        if (isOnObject === true) {
          // console.log(this.SuperMarioControl.getObject().position.length);

          this.SuperMarioAttribute.velocity.y = Math.max(0, this.SuperMarioAttribute.velocity.y);
          this.SuperMarioAttribute.canJump = true;
        }
        // console.log(this.attributes.elementList);
        this.SuperMarioControl.getObject().translateX(this.SuperMarioAttribute.velocity.x * delta * 100);
        this.SuperMarioControl.getObject().translateY(this.SuperMarioAttribute.velocity.y * delta * 100);
        this.SuperMarioControl.getObject().translateZ(this.SuperMarioAttribute.velocity.z * delta * 100);
        if (this.SuperMarioControl.getObject().position.y < 10) {
          this.SuperMarioAttribute.velocity.y = 0;
          this.SuperMarioControl.getObject().position.y = 0;
          this.SuperMarioAttribute.canJump = true;
        }
        this.SuperMarioAttribute.prevTime = time;
        this.renderer.render(this.scene, this.SuperMarioCamera);
      }

      // setTimeout( ()=> {
      //   console.warn(this.SuperMarioControl.getObject().position.y+"现在");
      // },delta)


      TWEEN.update();
      this.camera.updateProjectionMatrix();
    };
    this.render();
  }
}
export default threeControls;
