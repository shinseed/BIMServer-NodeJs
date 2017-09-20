

<template>

<el-row>
    <el-col :span="2">
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
        <vue-threejs-view :loadData='loaddata'/>
            <!-- <vue-threejs-view :loadData='loaddata2'/> -->
                <!-- <vue-threejs-view :loadData='loaddata2'/> -->
    </el-col>

</el-row>

</template>

<script>
var dataModel = function ( name, pathBase, fileObj, fileMtl, pathTexture, fileZip, pos, scale ) {
	this.name = name;
	this.pathBase = pathBase;
	this.fileObj = fileObj;
	this.fileMtl = fileMtl;
	this.pathTexture = pathTexture;
	this.fileZip = fileZip;
	this.pos = pos;
	this.scale = ! Boolean( scale ) ? 1.0 : scale;
	this.pivot = null;
};
var load=[];
var load2=[];
// load.push( new dataModel( 'oven', '/models/', 'xx.obj', null, null, 'xx.zip', { x: 0, y: 0, z: 0 } ) );
// load.push( new dataModel( 'male02', '/models/', 'xx.obj', 'xx.mtl', '/models/', null, { x: 0, y: 0, z: 0 } ) );
load.push( new dataModel( 'male01', '/models/', 'aa.obj', 'aa.mtl', '/models/', 'aa.zip', { x: 0, y: 100, z: 0 } ) );
// load2.push( new dataModel( 'male02', '/models/', 'aa.obj', 'aa.mtl', '/models/', null, { x: 0, y: 1000, z: 0 } ) );
export default {
    data() {
        return {
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
            loaddata:load,
            loaddata2:load2,
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    methods:{
      xx(){
        console.log(111);
      }
    }
};

</script>
