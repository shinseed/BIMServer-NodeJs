const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]

  },
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css'],
  plugins:[
    {
      src:'~/plugins/eleme-ui'
    },
    {
      src:'~/plugins/axios-config',
      ssr:false
        },
    {
      src:'~/plugins/JSZip',
      ssr:false
    },
    {
      src:'~/plugins/vue-threejs-view'
    }
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  build: {
    extend (config, { isDev, isClient }) {
      //nuxt bug 重复的webpack配置以及 混淆压缩
      config.plugins.forEach((item,index)=>{
        if(item.options){
          if(item.options.minimize){
            config.plugins.splice(index,1)
          }
          if(item.options.compress){
            item.options.mangle={
              except: ['Parser','Consts','Validator', 'RawObject','app', 'RawObjectDescription', 'WWOBJLoader','WWMeshCreator','WWOBJLoaderRef','WWOBJLoaderRunner']
            }
          }
        }

      })
    }
}
}
