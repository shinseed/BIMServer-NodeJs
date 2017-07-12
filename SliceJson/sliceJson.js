/**
 * Created by lixin on 2017/3/15.
 */
const fs = require('fs');
const path = require('path')
const {mkdir,clone}=require('./com');


/**
 * 常量参数
 * modelPath 原模型地址
 * outputPath 导出模型地址
 * grading    粒度
 * */
const modelPath = __dirname + '/model/';
const outputPath = __dirname + '/output/';
const grading=20;


/**
 * 获取几何体的数据
 * */
function geometriesData(data, uuid) {
    for (let i of data) {
        if (i.uuid === uuid) {
            return i;
        }
    }
}

/**
 * 切割json方法
 * mainJson Model目录下的主Json
 * cloneJson 克隆json
 * tranferJson 单个object3D中转json
 * num 主json object.children
 * sliceFileName 切割后的模型名*/
var sliceJson=function () {
    mkdir(__dirname + '/output');
    fs.readdir(__dirname + '/model', function (err, files) {
        for (let i of files) {
            if (i.indexOf('.json') !== -1) {
                var mainJson = require(modelPath + i);
                var cloneJson = clone(mainJson);
                cloneJson.geometries.length = 0;
                cloneJson.object.children.length = 0;

                let tranferJson = [];
                let num = 0;
                let sliceFileName=0;

                for (num = 0; num < mainJson.object.children.length; num++) {
                    cloneJson.metadata.generator = '307610991@qq.com';
                    if (mainJson.object.children[num].children.length > 0) {
                        for (let j = 0; j < mainJson.object.children[num].children.length; j++) {
                            cloneJson.geometries.push(geometriesData(mainJson.geometries, mainJson.object.children[num].children[j].uuid));
                        }
                        if (tranferJson.length > 0) {
                            cloneJson.object.children.push(tranferJson[0]);
                            tranferJson.length = 0;
                        }
                        cloneJson.object.children.push(mainJson.object.children[num]);

                        mkdir(outputPath + i);
                        if (cloneJson.object.children.length > grading) {//怎么切
                            sliceFileName++;
                            fs.writeFile(outputPath + i + '/' + sliceFileName + '.json', JSON.stringify(cloneJson), (err) => {
                                if (err) throw err;
                                // console.log(`sliceJson complete!  —_@!`)
                            });
                            cloneJson.geometries.length = 0;
                            cloneJson.object.children.length = 0;
                        }
                    }
                    else {
                        tranferJson.push(mainJson.object.children[num])
                    }


                }


            }
        }
    });
}

/**
 * 模型数据的组成结构
 * geometries  几何体
 * object3D or RevitElement 模型主体
 * Mesh 网格
 * materials  材质
 * ******************对应关系*************************
 * object3D.children >  *Mesh
 * *Mesh.uuid <=> geometries.uuid
* */

//slicejson start
sliceJson();