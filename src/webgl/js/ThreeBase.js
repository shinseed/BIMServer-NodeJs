/**
 * Created by lixin on 2017/4/6.
 */
import * as THREE from 'three';
window.THREE = THREE;

/**
 * webgl基础信息
 * @param {jqelement} container --容器
 * @param {color} backgroundcolor --背景色
 * @注意:使用了jquery*/

const createRenderer = 'createRenderer';
const createCamera = 'createCamera';
const createGridHelp = 'createGridHelp';
const createScene = 'createScene';
const createLight = 'createLight';
const createResize = 'createResize';
class threeBase {
    constructor(id, state) {
        this.container = $(`#${id}`);
        this.state = state;

        this.backgroundColor = 0xFFFFFF; //白色

        this[createScene]();

        this[createLight]();

        this[createCamera]();

        this[createGridHelp]();

        this[createRenderer]();

        this[createResize]();

    }

    /**
     * 初始化场景
     * */
    [createScene]() {

        this.scene = new THREE.Scene();
    }

    /**
     * 渲染器初始化
     * */
    [createRenderer]() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true,
        });
        this.renderer.setClearColor(this.backgroundColor, 1.0); //给canvas设置白色背景
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.innerWidth(), this.container.innerHeight()); //设置渲染器尺寸
        this.renderer.shadowMap.enable = true; //开启渲染器阴影
        this.container.append(this.renderer.domElement);
    }

    /**
     * 摄像机初始化
     * @注意:默认为透视相机
     * todo 这里会有多种相机的切换
     * */
    [createCamera]() {
        this.camera = new THREE.PerspectiveCamera(45, this.container.innerWidth() / this.container.innerHeight(), 1, 1500000);
        this.camera.position.set(100000, 100000, 100000);
    }

    /**
     * 初始化一个透明的网格平面
     * */
    [createGridHelp]() {
        this.gridHelp = new THREE.GridHelper(800000, 10);
        this.gridHelp.position.set(0, 0, 0);
        this.gridHelp.shadowMap = true;
        this.gridHelp.castShadow = true;
        this.gridHelp.material.opacity = 0.25; //设置透明度
        this.gridHelp.material.transparent = true; //是否透明
        this.scene.add(this.gridHelp);
    }

    /**
     * 初始化光源
     * */
    [createLight]() {
        //
        this.light = new THREE.AmbientLight(0xFFFFFF); //添加一个默认的白色环境光源
        this.scene.add(this.light);

        var target = new THREE.Object3D();
        target.position.set(0, 5, 0);
        this.dir = new THREE.DirectionalLight(this.backgroundColor);
        this.dir.position.set(0, 200000, 0);
        this.dir.castShadow = true;
        this.dir.target = this.scene;
        this.scene.add(this.dir);
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
}
export default threeBase;
