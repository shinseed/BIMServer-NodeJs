import ThreeBase from '~/webgl/js/ThreeInterface'
import $ from 'jquery'

/**
 * 初始化webgl
 */
function webglInit() {
    //初始化 canvas 的宽高
    let state = {
        webglstyle: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    //容器要和内部canvas成比例 
    $('#webgl').attr('style', `width:${state.webglstyle.width}px;height:${state.webglstyle.height-20}px`)
    window.webgl = new ThreeBase('webgl', state);
}

/**
 * 创建 加载文件的数组对象
 * @return {[array]} array
 */
function createLoadModelInfo() {
    let arr = [];
    for (let i = 1; i < 22; i++) {
        arr.push({
            url: `static/整体的模型源文件.json/${i}.json`,
            type: '整体模型源文件',
            //加载模型初始的偏移位置
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            //加载模型的初始旋转角度
            rotation: {
                _order: "XYZ",
                _x: 0,
                _y: 0,
                _z: 0
            }

        })
    }
    return arr;
}

/**
 * 加载模型 
 * @param  {[array]} arr [加载模型的数组对象]
 */
function loadModel(arr) {
    window.webgl.LoadJsonArr({
        data: arr,
        state: true
    }, function(callback) {
        //加载进度信息
        console.log(callback)
    })
}
/**
 * dom完成后 初始化
 */
window.onload = function() {

    webglInit();

    loadModel(createLoadModelInfo());

    //监听 超级玛丽按钮
    $('#superMario').on('click', function() {

        //开启超级玛丽模式
        window.webgl.SuperMarioStart();
        $('#superMario').blur() //失去焦点
        // alert('w、a、s、d 空格 ps:只做了向下的碰撞检测')
    })
}
