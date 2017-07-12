/**
 * Created by lixin on 2017/4/6.
 */
import threeControls from './threeControls';
import * as THREE from 'three';
var TWEEN = require('tween.js');
var _ = require('lodash');
require('../libs//AssimpJSONLoader');
require('../libs//MTLLoader');
require('../libs//OBJLoader');
/**
 * three interface
 * */
const initLoadJson = 'initLoadJson';
const initAttrubute = 'initAttrubute';
const initModelInfo = 'initModelInfo';
const interaction = 'interaction';
class threeInterface extends threeControls {
    constructor(id, state) {
        super(id, state);

        this[initLoadJson]();

        this[initAttrubute]();

        this[initModelInfo]();

        this[interaction]();
    }

    /**
     * 加载模型相关控件
     * */
    [initLoadJson]() {
        this.mtlLoader = new THREE.MTLLoader();
        this.LoadMTLUrl = function(basePath, type, urlmtl, urlobj) {
            this.mtlLoader.setPath(basePath);
            this.mtlLoader.load(urlmtl, (materials) => {
                materials.preload();
                this.objLoader = new THREE.OBJLoader();
                this.objLoader.setMaterials(materials);
                this.objLoader.setPath(basePath);
                this.objLoader.load(urlobj, (object) => {
                    if(type=='道路'){
                        // object.position.z=-20000;
                        object.visible=false;
                    }
                    object.position.y = 20000;
                    object.scale.set(1000, 1000, 1000);
                    this.attributes.webglDb[type] = this.attributes.webglDb[type] || []; //if else 如果存在这个类型就不创建否则创建
                    this.attributes.webglDb[type].push(object);
                    this.scene.add(object);
                });
            });
        };



        this.jsonLoader = new THREE.AssimpJSONLoader();
        this.jsonloadFile = (url) => {
            this.jsonLoader.load(url, (object) => {
                console.log(object)
                object.scale.set(1, 1, 1)
                this.scene.add(object);
            });
        };
        /*加载JSON 文件夹*/
        this.objectLoader = new THREE.ObjectLoader();
        this.LoadJsonArr = function(arrData, callback) {
            //声明式
            if (arrData.state) { //是否清除原来的模型
                this.clearModel();
            }

            _.map(arrData.data, (i, num) => {

                this.objectLoader.load(i.url, (obj) => {

                    setTimeout(() => {
                        obj.name = i.url;
                        obj.position.set(arrData.data[num].position.x, arrData.data[num].position.y, arrData.data[num].position.z); //位置
                        obj.rotation.set(arrData.data[num].rotation._x, arrData.data[num].rotation._y, arrData.data[num].rotation._z); //视角

                        num++;
                        this.scene.add(obj); //添加场景

                        this.joinCollection(obj.children, i.type); //模型mesh模型的拼装

                        callback({
                            schedule: parseInt(num / arrData.data.length * 100) //进度信息
                        });

                    }, 1000 * num);

                });
            });


            //命令式
            // for (let i of arr) {
            //     this.objectLoader.load(i, (obj) => {
            //         setTimeout(() => {

            //             obj.name = i;
            //             num++;
            //             this.scene.add(obj);
            //             callback({
            //                 schedule: parseInt(num / arr.length * 100)
            //             });

            //             if (num === arr.length) {
            //                 this.processSceneGeometry();
            //                 callback({
            //                     schedule: parseInt(num / arr.length * 100)
            //                 });
            //                 console.log(this.SuperMarioControl)
            //             }
            //         }, 1000 * num);

            //     });

            // }
        };

        /**
         * 模型进度演示（分步）
         */
        this.LoadorDisModelStep = function() {
            this.initModel(false); //先让其全部为隐藏

            _.map(this.attributes.elementList, (i, num) => {
                setTimeout(() => {
                    i.visible = true;
                }, 30 * num); //再分别按照指定时间一个一个的显示出来
            });
        };

        /**
         * 显示或隐藏指定类型的管线
         * type --类型
         * isShow --true展示
         */
        this.LoadorDisByType = function(type, isShow) {
            // this.initModel(!isShow);

            _.map(this.attributes.webglDb[type], (i) => {
                i.visible = isShow; //对指定类型的网格隐藏或显示
            });

        };
        /**
         * 指定类型的网格颜色改变
         * type --类型
         */
        this.ChangeColorByType = function(type) {
            // this.initModelColor(); //所有网格颜色初始化
            _.map(this.attributes.webglDb[type], (i) => {
                i.material.color = {
                    b: 139 / 255,
                    g: 134 / 255,
                    r: 0
                }; //设置网格颜色
            });
        }



        /**
         * 获取指定type的网格并闪动
         * type--类型
         * isFront--是否为改迁前
         */
        this.LoadorDisLine = function(type, isFront) {
            if (!this.attributes.webglDb.hasOwnProperty(type)) {
                return; //如果没有这个类型的数据则返回
            }

            let initColor = this.attributes.webglDb[type][0].material.color;
            let length = this.attributes.webglDb[type].length; //得到指定类型下的所有网格的长度
            let n = isFront ? 0 : Math.round(length / 2); //如果是改迁前循环初始值为0否则为长度的一半
            let len = isFront ? Math.round(length / 2) : length; //如果是改迁前循环结束值为长度的一半否则为长度
            let color = isFront ? {
                b: 86 / 255,
                g: 144 / 255,
                r: 1
            } : {
                b: 102 / 255,
                g: 205 / 255,
                r: 0
            }; //为改迁前和改迁后分别设置颜色

            for (let j = 0; j < 4; j++) {
                setTimeout(() => {
                    if (j == 3) {
                        for (let i = n; i < len; i++) {
                            this.attributes.webglDb[type][i].visible = true;
                            this.attributes.webglDb[type][i].material.color = initColor; //设定颜色
                        }
                    } else if (j == 0 || j == 2) {
                        for (let i = n; i < len; i++) {
                            this.attributes.webglDb[type][i].visible = false; //对指定类型的指定子元素设置为不可见
                            this.attributes.webglDb[type][i].material.color = color; //设定颜色
                        }
                    } else {
                        for (let i = n; i < len; i++) {
                            this.attributes.webglDb[type][i].visible = true; //对指定类型的指定子元素设置为可见
                            this.attributes.webglDb[type][i].material.color = color; //设定颜色
                        }
                    }
                }, 300 * j);
            }
        }

        this.isHide = function(type) {
            if (this.attributes.webglDb[type][0].visible) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * 初始化模型 将所有网格设置为可见或不可见
         * isShow--是否全部显示或隐藏
         */
        this.initModel = function(isShow) {
            _.map(this.attributes.elementList, (i) => {
                i.visible = isShow;
            });
        }

        /**
         * 让所有网格颜色初始化
         */
        this.initModelColor = function() {
            _.map(this.attributes.elementList, (i) => {
                i.material.color = {
                    b: 0.4980392156862745,
                    g: 0.4980392156862745,
                    r: 0.4980392156862745
                };
            });
        }


        this.clearModel = function() {
            _.map(this.scene.children, (i, num) => {
                this.scene.remove(this.scene.children[4]); //每次切换模型需要保留前4个children,每次移除一个children就会少一个,
            }); //一直移除第五个就会清空所有类型为scene的children

            this.attributes.elementList.length = 0; //将所有网格清空
        }

    }

    /**
     * 模型点击相关
     */
    [initAttrubute]() {
        //选择元素集
        this.attributes.SelectedElement = function() {
            this.materials = [];
            this.id = -1;
            this.object = {};
        };
        //鼠标点击选择的模型元素 用new 来改变this指针
        this.attributes.previousClickedElement = new this.attributes.SelectedElement();

        //选择模型的样式
        this.attributes.clickedMaterial =
            new THREE.MeshLambertMaterial({
                color: 'rgb(56,182,255)',
            });

        //注册点击事件
        this.attributes.onMouseClick = (event) => {

            event.preventDefault();

            if (this.mouseupTime - this.mousedownTime > 500) { //优化视角操作不触发点击模型
                return;
            }
            //中转选择事件
            this.attributes.checkIfSelected(event);
        };

        //注册mousedown
        this.container.mousedown(() => {
            this.mousedownTime = new Date().getTime();
        });
        //注册mouseup
        this.container.mouseup(() => {
            this.mouseupTime = new Date().getTime();
        });
        //点击事件挂给dom元素
        this.container.click(this.attributes.onMouseClick);

        this.attributes.paintElement = function(elementToPaint, material) {

            elementToPaint.material = material;

        };

        this.attributes.storeSelectedObject = (selected, isObject3D) => {

            if (isObject3D) {
                this.attributes.previousClickedElement.id = selected.parent.id;

                for (var i = 0; i < selected.parent.children.length; i++) {
                    this.attributes.previousClickedElement.materials.push(selected.parent.children[i].material);
                }

                this.attributes.previousClickedElement.object = selected.parent;
            } else {
                this.attributes.previousClickedElement.id = selected.id;

                this.attributes.previousClickedElement.materials.push(selected.material);

                this.attributes.previousClickedElement.object = selected;
            }

        };

        /**
         * 放弃选择模型*/
        this.attributes.restorePreviouslySelectedObject = () => {

            if (this.attributes.previousClickedElement.id === -1) return;


            if (this.attributes.previousClickedElement.object.type === 'Object3D') {

                for (var i = 0; i < this.attributes.previousClickedElement.materials.length; i++) {
                    this.attributes.paintElement(
                        this.attributes.previousClickedElement.object.children[i],
                        this.attributes.previousClickedElement.materials[i]
                    );
                }


            } else {

                this.attributes.paintElement(
                    this.attributes.previousClickedElement.object,
                    this.attributes.previousClickedElement.materials[0]
                );
            }
            /**
             * 放弃选择模型透明*/
            for (let i of this.attributes.elementList) {
                i.material.opacity = 0.5;
            }
            this.attributes.previousClickedElement.id = -1;
            this.attributes.previousClickedElement.materials = [];
            this.attributes.previousClickedElement.object = {};

        };

        /**
         * 判断模型是否选中
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        this.attributes.checkIfSelected = (event) => {
            var children = this.container.children();
            var canvas = {};
            for (var i = 0; i < children.length; i++) {
                if (children[i].tagName === 'CANVAS') {
                    canvas = $(children[i]);

                    break;
                }
            }

            var win = $(window);
            var offsetX = canvas.offset().left - win.scrollLeft();
            var offsetY = canvas.offset().top - win.scrollTop();


            //鼠标控制
            //参考资料: https://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects/23492823#23492823
            var mouse3D = new THREE.Vector3(((event.clientX - offsetX) / canvas.width()) * 2 - 1, -((event.clientY - offsetY) / canvas.height()) * 2 + 1, 0.5); //OFFSET THE MOUSE CURSOR BY -7PX!!!!
            mouse3D.unproject(this.camera);
            mouse3D.sub(this.camera.position);
            mouse3D.normalize();
            // console.log(mouse3D);

            var raycaster = new THREE.Raycaster(this.camera.position, mouse3D);

            var intersects = raycaster.intersectObjects(this.attributes.elementList);

            if (intersects.length > 0) {

                var myIntersect;
                var j = 0;

                while (j < intersects.length) {
                    myIntersect = intersects[j].object;
                    j++;
                    if (myIntersect.visible == true) break;
                }

                if (myIntersect.visible == true) {
                    if (myIntersect.id === this.attributes.previousClickedElement.id) return;

                    if (this.attributes.previousClickedElement.id !== -1) {
                        this.attributes.restorePreviouslySelectedObject();
                    }


                    var isObject3D = false;

                    if (myIntersect.parent.type === 'Object3D') {
                        isObject3D = true;
                    }


                    this.attributes.storeSelectedObject(myIntersect, isObject3D);

                    if (isObject3D) {
                        for (let i = 0; i < myIntersect.parent.children.length; i++) {
                            this.attributes.paintElement(myIntersect.parent.children[i], this.attributes.clickedMaterial);
                        }
                    } else {
                        this.attributes.paintElement(myIntersect, this.attributes.clickedMaterial);
                    }


                    if (isObject3D) {
                        //添加数据
                        this.attributes.populateAttributeList(myIntersect.parent.userData);
                    } else {
                        this.attributes.populateAttributeList(myIntersect.userData);
                    }
                } else {
                    if (this.attributes.previousClickedElement.id !== -1) {
                        this.attributes.restorePreviouslySelectedObject();

                        this.attributes.attributeListDiv.hide('slow');
                    }
                }
                this.animateModel(this.orbitControl.object.position, this.orbitControl.target);

            } else {

                if (this.attributes.previousClickedElement.id !== -1) {
                    this.attributes.restorePreviouslySelectedObject();

                    // this.attributes.attributeListDiv.hide("slow");
                }
            }

        };

        //填充用户列表
        this.attributes.populateAttributeList = (jsonData) => {
            this.state.userData = jsonData;
        };
    }

    /**
     * 模型数据相关
     * */
    [initModelInfo]() {
        //材质设置 暂时没用到
        this.makeFaceMaterialsWork = () => {
            for (let _i of this.scene.children) {
                if (_i.type === 'Scene') {
                    var items = _i.children;
                    for (var i = 0, iLen = _i.children.length; i < iLen; i++) {
                        // items = this.scene.children;
                        if (items[i].hasOwnProperty('geometry')) {

                            var geo = items[i].geometry;
                            var currentMat = items[i].material;
                            var userData = items[i].userData;

                            if (currentMat.hasOwnProperty('materials') && userData.hasOwnProperty('WebGl_FaceColorIndexes')) {


                                var faceColors = userData.WebGl_FaceColorIndexes.split(',');

                                for (var j in geo.faces) {
                                    geo.faces[j].materialIndex = faceColors[j];
                                }
                                geo.elementsNeedUpdate = true;

                                delete userData['WebGl_FaceColorIndexes'];
                            }
                        }
                    }
                }
            }
        };
        /**
         * 连接模型mesh集合
         * @param  {[type]} arr [description]
         * @return {[type]}     [description]
         */
        this.joinCollection = (arr, type) => {
            this.attributes.webglDb[type] = this.attributes.webglDb[type] || []; //if else 如果存在这个类型就不创建否则创建
            _.map(arr, (item) => {
                if (item.hasOwnProperty('geometry')) {
                    item.material.transparent = true;
                    item.material.opacity = 0.7;
                    this.attributes.elementList.push(item);
                    this.attributes.webglDb[type].push(item);
                } else if (item.children.length > 0) {
                    for (let i of item.children) {
                        i.material.transparent = true;
                        i.material.opacity = 0.7;
                        this.attributes.elementList.push(i);
                        this.attributes.webglDb[type].push(i);
                    }

                }
            });
        };
        /**
         * 模型mesh的集合  暂时被joinCollection代替 性能比这个高
         * @return {[type]} [description]
         */
        this.processSceneGeometry = function() {
            for (let _i of this.scene.children) {
                if (_i.type === 'Scene') {
                    var items = _i.children;
                    for (var i = 0, iLen = _i.children.length; i < iLen; i++) {

                        if (items[i].hasOwnProperty('geometry')) {
                            //three.js stuff
                            // items[i].geometry.mergeVertices();
                            // items[i].geometry.computeFaceNormals();
                            // items[i].geometry.computeVertexNormals();
                            items[i].castShadow = true;
                            items[i].receiveShadow = true;
                            items[i].material.transparent = true;
                            items[i].material.opacity = 0.5;
                            this.attributes.elementList.push(items[i]);


                        }
                        //对revti 文件特殊处理
                        else if (items[i].children.length > 0) {
                            // items[i].castShadow = true;
                            // items[i].receiveShadow = true;
                            var itemsChildren = items[i].children;
                            for (var k = 0, kLen = itemsChildren.length; k < kLen; k++) {
                                if (itemsChildren[k].hasOwnProperty('geometry')) {
                                    // itemsChildren[k].geometry.mergeVertices();
                                    // itemsChildren[k].geometry.computeFaceNormals();
                                    // itemsChildren[k].geometry.computeVertexNormals();
                                    // itemsChildren[k].material.side = 2;
                                    // itemsChildren[k].castShadow = true;
                                    // itemsChildren[k].receiveShadow = true;
                                    itemsChildren[k].material.transparent = true;
                                    itemsChildren[k].material.opacity = 0.7;
                                    this.attributes.elementList.push(itemsChildren[k]);

                                }
                            }
                        }
                    }
                }

            }

        };
        //计算场景的边界范围 暂时没用到
        this.computeBoundingSphere = () => {

            var geo = new THREE.Geometry();
            this.scene.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    geo.merge(child.geometry);
                }
            });
            geo.computeBoundingSphere();

            this.boundingSphere = geo.boundingSphere;

        };
        //暂时没用到
        this.zoomSelected = () => {

            if (this.attributes.previousClickedElement === undefined) return;

            if (this.attributes.previousClickedElement.id === -1) return;

            var bndSphere;
            var sel = this.attributes.previousClickedElement.object;

            if (sel.hasOwnProperty('geometry')) {
                //sel.computeBoundingSphere();
                bndSphere = sel.geometry.boundingSphere;
            } else {
                var geo = new THREE.Geometry();
                for (var i in sel.children) {
                    geo.merge(sel.children[i].geometry);
                }
                geo.computeBoundingSphere();
                bndSphere = geo.boundingSphere;
            }


            var r = bndSphere.radius;
            var offset = r / Math.tan(Math.PI / 180.0 * this.orbitControl.object.fov * 0.5);
            var vector = new THREE.Vector3(0, 0, 1);
            var dir = vector.applyQuaternion(this.orbitControl.object.quaternion);
            var newPos = new THREE.Vector3();
            dir.multiplyScalar(offset * 1.1);
            newPos.addVectors(bndSphere.center, dir);
            this.orbitControl.object.position.set(newPos.x, newPos.y, newPos.z);
            this.orbitControl.target = new THREE.Vector3(bndSphere.center.x, bndSphere.center.y, bndSphere.center.z);
        };
        //返回视角函数 暂时没用到
        this.zoomExtents = () => {

            if (this.boundingSphere === undefined) this.computeBoundingSphere();


            var r = this.boundingSphere.radius;
            var offset = r / Math.tan(Math.PI / 180.0 * this.orbitControl.object.fov * 0.5);
            var vector = new THREE.Vector3(0, 0, 1);
            var dir = vector.applyQuaternion(this.orbitControl.object.quaternion);
            var newPos = new THREE.Vector3();
            dir.multiplyScalar(offset * 1.25);
            newPos.addVectors(this.boundingSphere.center, dir);
            this.orbitControl.object.position.set(newPos.x, newPos.y, newPos.z);
            this.orbitControl.target = new THREE.Vector3(this.boundingSphere.center.x, this.boundingSphere.center.y, this.boundingSphere.center.z);

        };

        /**
         * 模型点击动画定位
         * @param  {[type]} oldP [description]
         * @param  {[type]} oldT [description]
         * @return {[type]}      [description]
         */
        this.animateModel = (oldP, oldT) => {

            if (this.attributes.previousClickedElement === undefined) return;

            if (this.attributes.previousClickedElement.id === -1) return;

            var bndSphere;
            var sel = this.attributes.previousClickedElement.object;

            if (sel.hasOwnProperty('geometry')) {
                //sel.computeBoundingSphere();
                bndSphere = sel.geometry.boundingSphere;
            } else {
                var geo = new THREE.Geometry();
                for (var i in sel.children) {
                    geo.merge(sel.children[i].geometry);
                }
                geo.computeBoundingSphere();
                bndSphere = geo.boundingSphere;
            }


            var r = bndSphere.radius;
            var offset = r / Math.tan(Math.PI / 180.0 * this.orbitControl.object.fov * 0.5);
            var vector = new THREE.Vector3(0, 0, 1);
            var dir = vector.applyQuaternion(this.orbitControl.object.quaternion);
            var newPos = new THREE.Vector3();
            dir.multiplyScalar(offset * 1.1);
            newPos.addVectors(bndSphere.center, dir);

            /**
             * 选择模型透明*/
            for (let i of this.attributes.elementList) {
                if (i.uuid !== sel.uuid) {
                    i.material.opacity = 0.1;
                }

            }
            var that = this;
            var tween = new TWEEN.Tween(oldP)
                .to({
                    x: newPos.x,
                    y: newPos.y,
                    z: newPos.z
                }, 1000)
                /**
                 * Circular 间接的动画
                 * Elastic  弹性动画
                 * Exponential 指数动画
                 * Back  后退动画
                 * Bounce 抖动
                 * Sinusoidal 正弦曲线动画
                 * Quintic 5次方动画
                 * Quartic 4次方
                 * Cubic   立方体动画
                 * Quadratic 2次方动画*/
                .easing(TWEEN.Easing.Exponential.InOut)
                .onUpdate(() => {
                    that.orbitControl.target = new THREE.Vector3(bndSphere.center.x, bndSphere.center.y, bndSphere.center.z);

                });

            var tween1 = new TWEEN.Tween(oldT)
                .to({
                    x: newPos.x,
                    y: newPos.y,
                    z: newPos.z
                }, 10)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onUpdate(() => {
                    that.orbitControl.object.position.set(newPos.x, newPos.y, newPos.z);

                });
            tween.chain(tween1);
            tween.start();
        };
    }
    /**
     * 交互操作
     */
    [interaction]() {

    }
}
export default threeInterface;
