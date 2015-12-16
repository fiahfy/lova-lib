module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var _app = __webpack_require__(2);

	var _app2 = _interopRequireDefault(_app);

	var _koa = __webpack_require__(30);

	var _koa2 = _interopRequireDefault(_koa);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = (0, _koa2.default)();

	_app2.default.route(app);

	app.listen(_app2.default.port, _app2.default.ip);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _koaRouter = __webpack_require__(3);

	var _koaRouter2 = _interopRequireDefault(_koaRouter);

	var _koaStatic = __webpack_require__(4);

	var _koaStatic2 = _interopRequireDefault(_koaStatic);

	var _koaSend = __webpack_require__(5);

	var _koaSend2 = _interopRequireDefault(_koaSend);

	var _crypto = __webpack_require__(6);

	var _crypto2 = _interopRequireDefault(_crypto);

	var _lruCache = __webpack_require__(7);

	var _lruCache2 = _interopRequireDefault(_lruCache);

	var _controllers = __webpack_require__(8);

	var _controllers2 = _interopRequireDefault(_controllers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var router = (0, _koaRouter2.default)();

	var cache = (0, _lruCache2.default)({ maxAge: 1000 * 60 });

	var config = {
	  port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
	  ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	  development: process.env.OPENSHIFT_NODEJS_IP === undefined
	};

	config.route = function (app) {
	  app.use(regeneratorRuntime.mark(function _callee(next) {
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            if (!(this.path.indexOf('/api/') > -1)) {
	              _context.next = 5;
	              break;
	            }

	            _context.next = 3;
	            return next;

	          case 3:
	            _context.next = 12;
	            break;

	          case 5:
	            if (!(this.path.indexOf('.') > -1)) {
	              _context.next = 10;
	              break;
	            }

	            _context.next = 8;
	            return next;

	          case 8:
	            _context.next = 12;
	            break;

	          case 10:
	            _context.next = 12;
	            return (0, _koaSend2.default)(this, '/index.html', { root: 'public' });

	          case 12:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this);
	  }));
	  app.use((0, _koaStatic2.default)('public', { maxage: 10 * 60 * 1000 }));
	  if (!config.development) {
	    app.use(regeneratorRuntime.mark(function _callee2(next) {
	      var key, value;
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              if (!(this.path.indexOf('.') > -1)) {
	                _context2.next = 5;
	                break;
	              }

	              _context2.next = 3;
	              return next;

	            case 3:
	              _context2.next = 13;
	              break;

	            case 5:
	              key = _crypto2.default.createHash('md5').update(this.url).digest('hex');
	              value = cache.get(key);

	              if (!value) {
	                _context2.next = 10;
	                break;
	              }

	              this.body = value;
	              return _context2.abrupt('return');

	            case 10:
	              _context2.next = 12;
	              return next;

	            case 12:
	              cache.set(key, this.body);

	            case 13:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, _callee2, this);
	    }));
	  }
	  router.get('/sitemap.xml', _controllers2.default.sitemap);
	  router.get('/api/', _controllers2.default.root);
	  router.get('/api/servants/', _controllers2.default.servants);
	  router.get('/api/servants/:id/', _controllers2.default.servants);
	  router.get('/api/prizes/', _controllers2.default.prizes);
	  /// deprecated
	  router.get('/api/ranking/servants/:mode/:year/:month/:date/', _controllers2.default.ranking.servants);
	  router.get('/api/ranking/servants/:mode/latest/', _controllers2.default.ranking.servants);
	  router.get('/api/ranking/servants/:id/:mode/:year/:month/:date/', _controllers2.default.ranking.servants);
	  ///
	  router.get('/api/servants/statistics/', _controllers2.default.servantsStatistics);
	  router.get('/api/spells/statistics/', _controllers2.default.spellsStatistics);
	  app.use(router.routes());
	};

	exports.default = config;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("koa-router");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("koa-static");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("koa-send");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("lru-cache");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// let fs = require('fs');
	//
	// fs.readdirSync(__dirname).forEach(function(file) {
	//   if (file !== 'index.js') {
	//     let fileName = file.split('.')[0];
	//     let moduleName = fileName.replace(/-(\w)/, function(match, p1, offset, string) {
	//       return p1.toUpperCase();
	//     });
	//     module.exports[moduleName] = require('./' + fileName);
	//   }
	// });

	module.exports = {
	  prizes: __webpack_require__(9),
	  root: __webpack_require__(21),
	  servantsStatistics: __webpack_require__(22),
	  servants: __webpack_require__(24),
	  sitemap: __webpack_require__(25),
	  spellsStatistics: __webpack_require__(27),
	  ranking: __webpack_require__(28)
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _marked = [prizes].map(regeneratorRuntime.mark);

	var models = __webpack_require__(10);

	function prizes() {
	  return regeneratorRuntime.wrap(function prizes$(_context) {
	    while (1) switch (_context.prev = _context.next) {
	      case 0:
	        _context.next = 2;
	        return models.prize.find({}).exec();

	      case 2:
	        this.body = _context.sent;

	      case 3:
	      case 'end':
	        return _context.stop();
	    }
	  }, _marked[0], this);
	}

	module.exports = prizes;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.spellranking = exports.servantranking = exports.prize = exports.servant = exports.counter = undefined;

	var _counter = __webpack_require__(16);

	Object.defineProperty(exports, 'counter', {
	  enumerable: true,
	  get: function get() {
	    return _counter.default;
	  }
	});

	var _servant = __webpack_require__(18);

	Object.defineProperty(exports, 'servant', {
	  enumerable: true,
	  get: function get() {
	    return _servant.default;
	  }
	});

	var _prize = __webpack_require__(17);

	Object.defineProperty(exports, 'prize', {
	  enumerable: true,
	  get: function get() {
	    return _prize.default;
	  }
	});

	var _servantranking = __webpack_require__(19);

	Object.defineProperty(exports, 'servantranking', {
	  enumerable: true,
	  get: function get() {
	    return _servantranking.default;
	  }
	});

	var _spellranking = __webpack_require__(20);

	Object.defineProperty(exports, 'spellranking', {
	  enumerable: true,
	  get: function get() {
	    return _spellranking.default;
	  }
	});

	var _fs = __webpack_require__(11);

	var _fs2 = _interopRequireDefault(_fs);

	var _mongoose = __webpack_require__(12);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _mongodb = __webpack_require__(13);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _logger = __webpack_require__(14);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_mongoose2.default.connect(_mongodb2.default.uri);

	_mongoose2.default.connection.on('connected', function () {
	  _logger2.default.info('Mongoose default connection open to ' + _mongodb2.default.uri);
	});

	_mongoose2.default.connection.on('error', function (err) {
	  _logger2.default.error('Mongoose default connection error: ' + err);
	});

	_mongoose2.default.connection.on('disconnected', function () {
	  _logger2.default.info('Mongoose default connection disconnected');
	});

	process.on('SIGINT', function () {
	  _mongoose2.default.connection.close(function () {
	    _logger2.default.info('Mongoose default connection disconnected through app termination');
	    process.exit(0);
	  });
	});

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _url = __webpack_require__(31);

	var _url2 = _interopRequireDefault(_url);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	  host: process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',
	  port: process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
	  user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
	  pass: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
	  protocol: 'mongodb',
	  db: 'lova'
	};

	var host = config.host;
	var port = config.port;
	var user = config.user;
	var pass = config.pass;
	var protocol = config.protocol;
	var db = config.db;

	config.uri = _url2.default.format({
	  protocol: protocol + ':',
	  slashes: true,
	  auth: user && pass ? user + ':' + pass : null,
	  hostname: host,
	  port: port,
	  pathname: '/' + db
	});

	exports.default = config;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var winston = __webpack_require__(15);

	var logger = new winston.Logger({
	  transports: [new winston.transports.Console({ level: 'silly', timestamp: true })]
	});
	logger.cli();

	module.exports = logger;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("winston");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(12);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;

	var CounterSchema = new Schema({
	  _id: String,
	  seq: Number
	});

	CounterSchema.statics.getNewId = function (name, callback) {
	  return new Promise(function (resolve, reject) {
	    undefined.collection.findAndModify({ _id: name }, [], { $inc: { seq: 1 } }, { new: true, upsert: true }, function (err, result) {
	      if (callback) {
	        callback(err, result);
	      }
	      if (err) {
	        reject({ err: err, result: result });
	        return;
	      }
	      resolve({ err: err, result: result });
	    });
	  });
	};

	exports.default = _mongoose2.default.model('counter', CounterSchema);

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(12);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;

	var PrizeSchema = new Schema({
	  _id: { type: Number, require: true, unique: true },
	  name: { type: String, require: true },
	  rate: { type: Number, require: true },
	  date: { type: Date, require: true }
	}, { id: false });

	PrizeSchema.virtual('id').get(function () {
	  return this._id;
	});

	PrizeSchema.set('toJSON', {
	  virtuals: true
	});

	exports.default = _mongoose2.default.model('prize', PrizeSchema);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(12);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;

	var ServantSchema = new Schema({
	  _id: { type: Number, require: true, unique: true },
	  tribe_id: { type: Number, require: true },
	  tribe_name: { type: String, require: true },
	  tribe_code: { type: Number, require: true },
	  type: String,
	  name: String,
	  cost: Number,
	  range: Number,
	  release_date: Date,
	  update_date: Date,
	  illustration_by: String,
	  character_voice: String,
	  oral_tradition: String,
	  skill: {
	    active: {
	      name: String,
	      designation: String,
	      effect: String,
	      description: String,
	      ap: [Number],
	      cd: [Number]
	    },
	    passive: {
	      name: String,
	      designation: String,
	      effect: String,
	      description: String,
	      ap: [Number],
	      cd: [Number]
	    }
	  },
	  status: {
	    1: {
	      hp: Number,
	      ap: Number,
	      atk: Number,
	      pow: Number,
	      def: Number,
	      res: Number,
	      ms: Number,
	      as: Number
	    },
	    20: {
	      hp: Number,
	      ap: Number,
	      atk: Number,
	      pow: Number,
	      def: Number,
	      res: Number,
	      ms: Number,
	      as: Number
	    }
	  }
	}, { id: false });

	ServantSchema.virtual('id').get(function () {
	  return this._id;
	});

	ServantSchema.set('toJSON', {
	  virtuals: true
	});

	exports.default = _mongoose2.default.model('servant', ServantSchema);

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(12);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;

	var ServantrankingShema = new Schema({
	  _id: { type: Number, require: true, unique: true },
	  date: { type: Date, require: true },
	  mode: { type: String, require: true },
	  map: { type: String, require: true },
	  queue: { type: String, require: true },
	  servant_id: { type: Number, require: true },
	  seq: { type: Number, require: true },
	  rank: { type: Number, require: true },
	  score: { type: Number, require: true }
	}, { id: false });

	ServantrankingShema.virtual('id').get(function () {
	  return this._id;
	});

	ServantrankingShema.set('toJSON', {
	  virtuals: true
	});

	exports.default = _mongoose2.default.model('servantranking', ServantrankingShema);

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(12);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;

	var SpellrankingShema = new Schema({
	  _id: { type: Number, require: true, unique: true },
	  date: { type: Date, require: true },
	  map: { type: String, require: true },
	  queue: { type: String, require: true },
	  spell_id: { type: Number, require: true },
	  seq: { type: Number, require: true },
	  rank: { type: Number, require: true },
	  score: { type: Number, require: true }
	}, { id: false });

	SpellrankingShema.virtual('id').get(function () {
	  return this._id;
	});

	SpellrankingShema.set('toJSON', {
	  virtuals: true
	});

	exports.default = _mongoose2.default.model('spellranking', SpellrankingShema);

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	var _marked = [root].map(regeneratorRuntime.mark);

	function root() {
	  return regeneratorRuntime.wrap(function root$(_context) {
	    while (1) switch (_context.prev = _context.next) {
	      case 0:
	        this.body = { node_version: process.version };

	      case 1:
	      case 'end':
	        return _context.stop();
	    }
	  }, _marked[0], this);
	}

	module.exports = root;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _marked = [servantsStatistics].map(regeneratorRuntime.mark);

	var _ = __webpack_require__(23);
	var models = __webpack_require__(10);

	function servantsStatistics() {
	  var d, params;
	  return regeneratorRuntime.wrap(function servantsStatistics$(_context) {
	    while (1) switch (_context.prev = _context.next) {
	      case 0:
	        _context.next = 2;
	        return models.servantranking.findOne({}).sort({ date: -1 }).exec();

	      case 2:
	        _context.t0 = _context.sent.date;

	        if (_context.t0) {
	          _context.next = 5;
	          break;
	        }

	        _context.t0 = new Date();

	      case 5:
	        d = _context.t0;
	        _context.t1 = this.query.term;
	        _context.next = _context.t1 === 'day' ? 9 : _context.t1 === 'month' ? 10 : 11;
	        break;

	      case 9:
	        return _context.abrupt('break', 11);

	      case 10:
	        d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30));

	      case 11:
	        params = _.pick(this.query, function (value, key) {
	          return ['servant_id', 'mode', 'map', 'queue'].indexOf(key) > -1;
	        });

	        params.date = { $gte: d };

	        _context.next = 15;
	        return models.servantranking.find(params, '-_id servant_id date mode map queue score').sort({ date: 1 }).exec();

	      case 15:
	        this.body = _context.sent;

	      case 16:
	      case 'end':
	        return _context.stop();
	    }
	  }, _marked[0], this);
	}

	module.exports = servantsStatistics;

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _marked = [servants, getLastDate, getStatistics].map(regeneratorRuntime.mark);

	var models = __webpack_require__(10);

	function servants() {
	  var fields, id, _servants, _statistics, servants, statistics;

	  return regeneratorRuntime.wrap(function servants$(_context) {
	    while (1) switch (_context.prev = _context.next) {
	      case 0:
	        fields = (this.query.fields || '').replace(',', ' ');
	        id = this.params.id;

	        if (!id) {
	          _context.next = 16;
	          break;
	        }

	        _context.next = 5;
	        return models.servant.findOne({ _id: id }, fields).exec();

	      case 5:
	        _servants = _context.sent;

	        if (!(typeof this.query.with_statistic == 'undefined')) {
	          _context.next = 9;
	          break;
	        }

	        this.body = _servants;
	        return _context.abrupt('return');

	      case 9:
	        _servants = deepCopy(_servants);
	        _context.next = 12;
	        return getStatistics(id);

	      case 12:
	        _statistics = _context.sent;

	        _servants = mergeStatistics(_servants, _statistics);
	        this.body = _servants;
	        return _context.abrupt('return');

	      case 16:
	        _context.next = 18;
	        return models.servant.find({}, fields).sort({ _id: 1 }).exec();

	      case 18:
	        servants = _context.sent;

	        if (!(typeof this.query.with_statistic == 'undefined')) {
	          _context.next = 22;
	          break;
	        }

	        this.body = servants;
	        return _context.abrupt('return');

	      case 22:
	        servants = deepCopy(servants);
	        _context.next = 25;
	        return getStatistics();

	      case 25:
	        statistics = _context.sent;

	        servants.forEach(function (e) {
	          e = mergeStatistics(e, statistics);
	        });
	        this.body = servants;

	      case 28:
	      case 'end':
	        return _context.stop();
	    }
	  }, _marked[0], this);
	}

	function getLastDate() {
	  var statistic;
	  return regeneratorRuntime.wrap(function getLastDate$(_context2) {
	    while (1) switch (_context2.prev = _context2.next) {
	      case 0:
	        _context2.next = 2;
	        return models.servantranking.findOne().sort({ date: -1 }).exec();

	      case 2:
	        statistic = _context2.sent;
	        return _context2.abrupt('return', statistic ? statistic.date : new Date());

	      case 4:
	      case 'end':
	        return _context2.stop();
	    }
	  }, _marked[1], this);
	}

	function getStatistics(servantId) {
	  var date, params, statistics;
	  return regeneratorRuntime.wrap(function getStatistics$(_context3) {
	    while (1) switch (_context3.prev = _context3.next) {
	      case 0:
	        _context3.next = 2;
	        return getLastDate();

	      case 2:
	        date = _context3.sent;
	        params = {
	          date: date,
	          map: 'all',
	          queue: 'all'
	        };

	        if (servantId) {
	          params['servant_id'] = servantId;
	        }
	        _context3.next = 7;
	        return models.servantranking.find(params, '-_id servant_id mode score').exec();

	      case 7:
	        statistics = _context3.sent;

	        statistics = statistics.reduce(function (prev, current) {
	          var servantId = current.servant_id;
	          if (!prev[servantId]) {
	            prev[servantId] = {};
	          }
	          prev[servantId][current.mode] = current.score;
	          return prev;
	        }, {});
	        return _context3.abrupt('return', statistics);

	      case 10:
	      case 'end':
	        return _context3.stop();
	    }
	  }, _marked[2], this);
	}

	function deepCopy(obj) {
	  return JSON.parse(JSON.stringify(obj));
	}

	function mergeStatistics(servants, statistics) {
	  if (!statistics[servants.id]) {
	    statistics[servants.id] = { win: 0, used: 0 };
	  }
	  servants['win_rate'] = statistics[servants.id]['win'] || 0;
	  servants['used_rate'] = statistics[servants.id]['used'] || 0;
	  return servants;
	}

	module.exports = servants;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _marked = [sitemap].map(regeneratorRuntime.mark);

	var xmlify = __webpack_require__(26);
	var models = __webpack_require__(10);

	function sitemap() {
	  var servants, urls, urlset;
	  return regeneratorRuntime.wrap(function sitemap$(_context) {
	    while (1) switch (_context.prev = _context.next) {
	      case 0:
	        _context.next = 2;
	        return models.servant.find({}, 'id').sort({ _id: 1 }).exec();

	      case 2:
	        servants = _context.sent;
	        urls = [];

	        urls.push('/');
	        urls.push('/about/');
	        urls.push('/charts/');
	        urls.push('/deck/');
	        urls.push('/prize/');
	        servants.forEach(function (e) {
	          urls.push('/servants/' + e.id + '/');
	        });

	        urls = urls.map(function (loc) {
	          return { loc: 'http://lova-fiahfy.rhcloud.com' + loc };
	        });

	        urlset = {
	          _xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
	          url: urls
	        };

	        this.type = 'xml';
	        this.body = xmlify(urlset, 'urlset');

	      case 14:
	      case 'end':
	        return _context.stop();
	    }
	  }, _marked[0], this);
	}

	module.exports = sitemap;

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("xmlify");

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _marked = [spellStatistics].map(regeneratorRuntime.mark);

	var _ = __webpack_require__(23);
	var models = __webpack_require__(10);

	function spellStatistics() {
	  var d, params;
	  return regeneratorRuntime.wrap(function spellStatistics$(_context) {
	    while (1) switch (_context.prev = _context.next) {
	      case 0:
	        _context.next = 2;
	        return models.spellranking.findOne({}).sort({ date: -1 }).exec();

	      case 2:
	        _context.t0 = _context.sent.date;

	        if (_context.t0) {
	          _context.next = 5;
	          break;
	        }

	        _context.t0 = new Date();

	      case 5:
	        d = _context.t0;
	        _context.t1 = this.query.term;
	        _context.next = _context.t1 === 'day' ? 9 : _context.t1 === 'month' ? 10 : 11;
	        break;

	      case 9:
	        return _context.abrupt('break', 11);

	      case 10:
	        d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30));

	      case 11:
	        params = _.pick(this.query, function (value, key) {
	          return ['servant_id', 'map', 'queue'].indexOf(key) > -1;
	        });

	        params.date = { $gte: d };

	        _context.next = 15;
	        return models.spellranking.find(params, '-_id spell_id date map queue score').sort({ date: 1 }).exec();

	      case 15:
	        this.body = _context.sent;

	      case 16:
	      case 'end':
	        return _context.stop();
	    }
	  }, _marked[0], this);
	}

	module.exports = spellStatistics;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var fs = __webpack_require__(11);

	// fs.readdirSync(__dirname).forEach(function(file) {
	//   if (file !== 'index.js') {
	//     let fileName = file.split('.')[0];
	//     let moduleName = fileName.replace(/-(\w)/, function(match, p1, offset, string) {
	//       return p1.toUpperCase();
	//     });
	//     module.exports[moduleName] = require('./' + fileName);
	//   }
	// });

	module.exports = {
	  servants: __webpack_require__(29)
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _marked = [servants].map(regeneratorRuntime.mark);

	var models = __webpack_require__(10);

	function servants() {
	  var d;
	  return regeneratorRuntime.wrap(function servants$(_context) {
	    while (1) switch (_context.prev = _context.next) {
	      case 0:
	        d = undefined;

	        if (!(this.params.year && this.params.month && this.params.date)) {
	          _context.next = 5;
	          break;
	        }

	        d = new Date(Date.UTC(this.params.year, this.params.month - 1, this.params.date));
	        _context.next = 8;
	        break;

	      case 5:
	        _context.next = 7;
	        return models.servantranking.findOne({ mode: this.params.mode, map: 'all', queue: 'all' }).sort({ date: -1 }).exec();

	      case 7:
	        d = _context.sent.date;

	      case 8:
	        _context.next = 10;
	        return models.servantranking.find({ mode: this.params.mode, map: 'all', queue: 'all', date: d }).sort({ seq: 1 }).exec();

	      case 10:
	        this.body = _context.sent;

	      case 11:
	      case 'end':
	        return _context.stop();
	    }
	  }, _marked[0], this);
	}

	module.exports = servants;

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = require("koa");

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map