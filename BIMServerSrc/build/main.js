require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("fs");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_lixin_Desktop_Open_Source_BIMServer_NodeJs_BIMServerSrc_node_modules_babel_runtime_regenerator__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_lixin_Desktop_Open_Source_BIMServer_NodeJs_BIMServerSrc_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Users_lixin_Desktop_Open_Source_BIMServer_NodeJs_BIMServerSrc_node_modules_babel_runtime_regenerator__);


var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = __webpack_require__(0);
var UUID = __webpack_require__(16);
var Realm = __webpack_require__(3);

var login = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_lixin_Desktop_Open_Source_BIMServer_NodeJs_BIMServerSrc_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx, next) {
    var email, password, realm, user;
    return __WEBPACK_IMPORTED_MODULE_0__Users_lixin_Desktop_Open_Source_BIMServer_NodeJs_BIMServerSrc_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = ctx.query['email'];
            password = ctx.query['password'];

            console.log(email, password);
            realm = new Realm();
            user = realm.objects('User').filtered('email="' + email + '"');
            // realm.write(() => {
            //   realm.create('User', {email: email,password:password,id:UUID.v1()});
            // });

            ctx.response.body = user;

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function login(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var isRepeatEmail = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0__Users_lixin_Desktop_Open_Source_BIMServer_NodeJs_BIMServerSrc_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(ctx, next) {
    var email, realm, user;
    return __WEBPACK_IMPORTED_MODULE_0__Users_lixin_Desktop_Open_Source_BIMServer_NodeJs_BIMServerSrc_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            email = ctx.query['email'];
            realm = new Realm();
            user = realm.objects('User').filtered('email="' + email + '"');

            if (user[0]) {
              ctx.response.body = { results: true };
            } else {
              ctx.response.body = { results: false };
            }

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  }));

  return function isRepeatEmail(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  'GET /api/login': login,
  'GET /api/isRepeatEmail': isRepeatEmail
};

/***/ },
/* 2 */
/***/ function(module, exports) {

var User = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    email: 'string',
    password: 'string',
    token: { type: 'string', optional: true },
    project: { type: 'string', optional: true }
  }
};

module.exports = User;

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("realm");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var UglifyJSPlugin = __webpack_require__(15);
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: 'Nuxt.js project' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]

  },
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css'],
  plugins: [{
    src: '~/plugins/eleme-ui'
  }, {
    src: '~/plugins/axios-config',
    ssr: false
  }, {
    src: '~/plugins/JSZip',
    ssr: false
  }, {
    src: '~/plugins/vue-threejs-view'
  }],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  build: {
    extend: function extend(config, _ref) {
      var isDev = _ref.isDev,
          isClient = _ref.isClient;

      //nuxt bug 重复的webpack配置以及 混淆压缩
      config.plugins.forEach(function (item, index) {
        if (item.options) {
          if (item.options.minimize) {
            config.plugins.splice(index, 1);
          }
          if (item.options.compress) {
            item.options.mangle = {
              except: ['Parser', 'Consts', 'Validator', 'RawObject', 'app', 'RawObjectDescription', 'WWOBJLoader', 'WWMeshCreator', 'WWOBJLoaderRef', 'WWOBJLoaderRunner']
            };
          }
        }
      });
    }
  }
};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var fs = __webpack_require__(0);
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log('register URL mapping: GET ' + path);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log('register URL mapping: POST ' + path);
        } else {
            console.log('invalid URL: ' + url);
        }
    }
}

function addControllers(router) {
    var files = fs.readdirSync(__dirname + '/controllers');
    var js_files = files.filter(function (f) {
        return f.endsWith('.js');
    });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = js_files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var f = _step.value;

            console.log('process controller: ' + f + '...');
            var mapping = __webpack_require__(11)("./" + f);
            addMapping(router, mapping);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

module.exports = function (dir) {
    var controllers_dir = dir || 'controllers',
        // 如果不传参数，扫描目录默认为'controllers'
    router = __webpack_require__(13)();
    addControllers(router, controllers_dir);
    return router.routes();
};
/* WEBPACK VAR INJECTION */}.call(exports, "server"))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var fs = __webpack_require__(0);
var Realm = __webpack_require__(3);

function addMapping(mapping) {
    var realm = new Realm({ schema: [mapping] });
}

function addControllers() {
    var files = fs.readdirSync(__dirname + '/realmDb');
    var js_files = files.filter(function (f) {
        return f.endsWith('.js');
    });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = js_files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var f = _step.value;

            console.log('process realmDb: ' + f + '...');
            var mapping = __webpack_require__(12)("./" + f);
            addMapping(mapping);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

module.exports = function () {
    addControllers();
};
/* WEBPACK VAR INJECTION */}.call(exports, "server"))

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("nuxt");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14);


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./login": 1,
	"./login.js": 1
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 11;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./user": 2,
	"./user.js": 2
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 12;


/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("koa-router");

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ },
/* 15 */
/***/ function(module, exports) {

module.exports = require("uglifyjs-webpack-plugin");

/***/ },
/* 16 */
/***/ function(module, exports) {

module.exports = require("uuid");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nuxt__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nuxt__);


var fs = __webpack_require__(0);
var bodyParser = __webpack_require__(8);
var controller = __webpack_require__(5);
var controller_realm = __webpack_require__(6);
var app = new __WEBPACK_IMPORTED_MODULE_0_koa___default.a();
var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 3000;

// Import and Set Nuxt.js options
var config = __webpack_require__(4);
config.dev = !(app.env === 'production');

// Instantiate nuxt.js
var nuxt = new __WEBPACK_IMPORTED_MODULE_1_nuxt__["Nuxt"](config);

// Build in development
if (config.dev) {
  var builder = new __WEBPACK_IMPORTED_MODULE_1_nuxt__["Builder"](nuxt);
  builder.build().catch(function (e) {
    console.error(e); // eslint-disable-line no-console
    process.exit(1);
  });
}

//add bodyParser middleware
app.use(bodyParser());
// add router middleware:
controller_realm();
app.use(controller());

app.use(function (ctx) {
  ctx.status = 200; // koa defaults to 404 when it sees that status is unset

  return new Promise(function (resolve, reject) {
    ctx.res.on('close', resolve);
    ctx.res.on('finish', resolve);
    nuxt.render(ctx.req, ctx.res, function (promise) {
      // nuxt.render passes a rejected promise into callback on error.
      promise.then(resolve).catch(reject);
    });
  });
});

app.listen(port, host);
console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console

/***/ }
/******/ ]);
//# sourceMappingURL=main.map