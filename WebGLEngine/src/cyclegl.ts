/**
 * cyclegl 命名空间
 * @author lixin https://github.com/shinseed/webgl-lifecycle
 */
namespace cyclegl{
	/**
	 * 版本号
	 * @type {number}
	 */
	export  var version:number=0.1;
	/**
	 * 获取浏览器webgl支持情况
	 * @return {object} [description]
	 */
	const getWebglInfo:any=function():any{

		let info={
			Webgl:false,
			Antialias:false,
			Fs_Max_Float_Precision:'',
			Detph_Buffer_Bits:''
		}

		let canvas =document.createElement('canvas');


		let gl=canvas.getContext('webgl',{antialias:true})||canvas.getContext('experimental-webgl',{antialias:true});

		info.Webgl=!!gl;

		if(!info.Webgl){
			return info;
		}

		info.Antialias=gl.getContextAttributes().antialias;

		if(gl.getShaderPrecisionFormat){
			if(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT).precision>0){
				info.Fs_Max_Float_Precision='high';
			}
			else if(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.MEDIUM_FLOAT).precision>0){
				info.Fs_Max_Float_Precision='medium'
			}
			else{
				info.Fs_Max_Float_Precision='low';
			}
		}else{
			info.Fs_Max_Float_Precision='medum'
		}

		info.Detph_Buffer_Bits=gl.getParameter(gl.DEPTH_BITS);

		return info;
		
	}
	
	export var webgl_info:object=getWebglInfo();

	export class scene{
		constructor(msg:string){
			alert(msg)
		}
	}

}
