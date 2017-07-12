import ThreeBase from '~/webgl/js/ThreeInterface'
import $ from 'jquery'

window.onload = function() {


    let state = {
            webglstyle: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
        //容器要和内部canvas成比例 
    $('#webgl').attr('style', `width:${state.webglstyle.width}px;height:${state.webglstyle.height}px`)
    window.webgl = new ThreeBase('webgl', state);
    let arr = [];
    for (let i = 1; i < 22; i++) {
        arr.push({
            url: `static/yygc/友谊广场站建筑结构模型/${i}.json`,
            type: '结构',
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
    window.webgl.LoadJsonArr({
        data: arr,
        state: true
    }, function(callback) {
        console.log(callback)
    })


      $('#superMario').on('click',function(){

        window.webgl.SuperMarioStart();
         $('#superMario').blur()//失去焦点
    })
}
