const fs = require('fs');
const middleware_check_token=require('./Middleware/middleware_check_token')


/**
 * addMapping - add controller mapping
 *
 * @param  {type} router
 * @param  {type} mapping
 * @return {type}          
 */
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            if(path.indexOf('NotCheckToken')!=-1){
              router.get(path,mapping[url]);
            }else{
              router.get(path, middleware_check_token,mapping[url]);
            }
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
              if(path.indexOf('NotCheckToken')!=-1){
                router.post(path, mapping[url]);
              }else{
                router.post(path,middleware_check_token, mapping[url]);
              }
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}


/**
 * addControllers
 *
 * @param  {type} router
 * @return {type}
 */
function addControllers(router) {
    var files = fs.readdirSync(__dirname + '/Controllers');
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/Controllers/' + f);
        addMapping(router, mapping);
    }
}

module.exports = function () {
    let router = require('koa-router')();
    addControllers(router);
    return router.routes();
};
