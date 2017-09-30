const fs=require('fs');
const Realm=require('realm');

function addMapping( mapping) {
  let realm = new Realm({schema: [mapping]});
}

function addControllers() {
    var files = fs.readdirSync(__dirname + '/Models');
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (var f of js_files) {
        console.log(`process realmDb: ${f}...`);
        let mapping = require(__dirname + '/Models/' + f);
        addMapping(mapping);
    }
}

module.exports=function () {
  addControllers();
}
