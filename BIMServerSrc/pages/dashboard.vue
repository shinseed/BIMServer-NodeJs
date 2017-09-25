

<template>

<el-row>
    <el-col :span="2">
      <i class="el-icon-edit" @click='aa'></i>
        <!-- <el-tree
      :data="data2"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"
      :props="defaultProps">
    </el-tree> -->
        <span id='feedback'></span>
    </el-col>
    <el-col :span="20">
        <vue-threejs-view v-on:listerThree="xx" :wh='wh'/>
        <!-- <vue-threejs-view :loadData='loaddata2'/> -->
        <!-- <vue-threejs-view :loadData='loaddata2'/> -->
    </el-col>

</el-row>

</template>

<script>

var dataModel = function(name, pathBase, fileObj, fileMtl, pathTexture, fileZip, pos, scale,rotate) {
    this.name = name;
    this.pathBase = pathBase;
    this.fileObj = fileObj;
    this.fileMtl = fileMtl;
    this.pathTexture = pathTexture;
    this.fileZip = fileZip;
    this.pos = pos;
    this.scale = !Boolean(scale) ? 1.0 : scale;
    this.pivot = null;
    this.rotate=rotate?rotate:{x:0,y:0,z:0,angle:0};
};
let _app;
var load = [];
var load2 = [];
// load.push( new dataModel( '车站', '/models/', 'xx.obj', 'xx.mtl', '/models/', 'xx.zip', { x: 0, y: 0, z: 0 },null,{x:1,y:0,z:0,angle:-90} ) );
load.push(new dataModel('管线', '/models/', 'aa.obj', 'aa.mtl', '/models/', 'aa.zip', {
    x: 0,
    y: 100,
    z: 0
}));
// load2.push( new dataModel( 'male02', '/models/', 'aa.obj', 'aa.mtl', '/models/', null, { x: 0, y: 1000, z: 0 } ) );
export default {
    head() {
            return {
                title: `dashboard Page (${this.name}-side)`
            }
        },
        asyncData({ req }) {
            return {
                name: req ? 'server' : 'client',
                data2: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
                wh:{width:1000,height:600},
                loaddata: load,
                loaddata2: load2,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            };
        },
        methods: {
            xx(app) {
              window._app=app;
              console.log(app);

              app.interfaceLoadObjOrZip(load,()=>{
                console.log('加载完成回调');
              })

            },
            aa(){
              _app.interfaceVisbileSelects();
            }
        }
};

</script>
