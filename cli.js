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

	var _mongoose = __webpack_require__(2);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _commander = __webpack_require__(3);

	var _commander2 = _interopRequireDefault(_commander);

	var _update = __webpack_require__(4);

	var updateCommands = _interopRequireWildcard(_update);

	var _download = __webpack_require__(22);

	var downloadCommands = _interopRequireWildcard(_download);

	var _sprite = __webpack_require__(27);

	var spriteCommands = _interopRequireWildcard(_sprite);

	var _logger = __webpack_require__(7);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var promise = null;

	_commander2.default.command('update-servant [url]').alias('ups').description('update servant data').option('-f, --force', 'force update', null, null).action(function (url, opts) {
	  promise = updateCommands.servant(url, opts.force);
	});

	_commander2.default.command('update-prize').alias('upp').description('update prize data').option('-f, --force', 'force update', null, null).action(function (opts) {
	  promise = updateCommands.prize(opts.force);
	});

	_commander2.default.command('update-ranking-servant').alias('uprs').description('update ranking servant data').option('-d, --date [date]', 'target date', null, null).option('--date-from [date]', 'target date from', null, null).option('--date-to [date]', 'target date to', null, null).option('-f, --force', 'force update', null, null).action(function (opts) {
	  promise = updateCommands.servantRanking(opts.date, opts.dateFrom, opts.dateTo, opts.force);
	});

	_commander2.default.command('update-ranking-spell').alias('uprp').description('update ranking spell data').option('-d, --date [date]', 'target date', null, null).option('--date-from [date]', 'target date from', null, null).option('--date-to [date]', 'target date to', null, null).option('-f, --force', 'force update', null, null).action(function (opts) {
	  promise = updateCommands.spellRanking(opts.date, opts.dateFrom, opts.dateTo, opts.force);
	});

	_commander2.default.command('download-servant').alias('dls').description('download servant images').option('-i, --id [id]', 'target servant id', null, null).option('-f, --force', 'force download', null, null).action(function (opts) {
	  promise = downloadCommands.servant(opts.id, opts.force);
	});

	_commander2.default.command('sprite-servant').alias('sps').description('create servant sprite image').action(function () {
	  promise = spriteCommands.servant();
	});

	_commander2.default.version('0.0.1').parse(process.argv);

	if (!promise) {
	  _commander2.default.help();
	}

	promise.then(function (reason) {
	  _mongoose2.default.disconnect();
	}, function (reason) {
	  _mongoose2.default.disconnect();
	  _logger2.default.error(reason);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("commander");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _servant = __webpack_require__(5);

	Object.defineProperty(exports, 'servant', {
	  enumerable: true,
	  get: function get() {
	    return _servant.default;
	  }
	});

	var _prize = __webpack_require__(19);

	Object.defineProperty(exports, 'prize', {
	  enumerable: true,
	  get: function get() {
	    return _prize.default;
	  }
	});

	var _servantRanking = __webpack_require__(20);

	Object.defineProperty(exports, 'servantRanking', {
	  enumerable: true,
	  get: function get() {
	    return _servantRanking.default;
	  }
	});

	var _spellRanking = __webpack_require__(21);

	Object.defineProperty(exports, 'spellRanking', {
	  enumerable: true,
	  get: function get() {
	    return _spellRanking.default;
	  }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (url, force) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
	    var urls, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _url;

	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            if (!url) {
	              _context.next = 4;
	              break;
	            }

	            _context.next = 3;
	            return updateOne(url, force);

	          case 3:
	            return _context.abrupt('return');

	          case 4:
	            _context.next = 6;
	            return getServantUrls();

	          case 6:
	            urls = _context.sent;
	            _iteratorNormalCompletion = true;
	            _didIteratorError = false;
	            _iteratorError = undefined;
	            _context.prev = 10;
	            _iterator = urls[Symbol.iterator]();

	          case 12:
	            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	              _context.next = 19;
	              break;
	            }

	            _url = _step.value;
	            _context.next = 16;
	            return updateOne(_url, force);

	          case 16:
	            _iteratorNormalCompletion = true;
	            _context.next = 12;
	            break;

	          case 19:
	            _context.next = 25;
	            break;

	          case 21:
	            _context.prev = 21;
	            _context.t0 = _context['catch'](10);
	            _didIteratorError = true;
	            _iteratorError = _context.t0;

	          case 25:
	            _context.prev = 25;
	            _context.prev = 26;

	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }

	          case 28:
	            _context.prev = 28;

	            if (!_didIteratorError) {
	              _context.next = 31;
	              break;
	            }

	            throw _iteratorError;

	          case 31:
	            return _context.finish(28);

	          case 32:
	            return _context.finish(25);

	          case 33:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[10, 21, 25, 33], [26,, 28, 32]]);
	  }));
	};

	var _co = __webpack_require__(6);

	var _co2 = _interopRequireDefault(_co);

	var _logger = __webpack_require__(7);

	var _logger2 = _interopRequireDefault(_logger);

	var _scraper = __webpack_require__(9);

	var scraper = _interopRequireWildcard(_scraper);

	var _models = __webpack_require__(11);

	var models = _interopRequireWildcard(_models);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function updateOne(url, force) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
	    var servant, row;
	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            _context2.next = 2;
	            return getServantWithUrl(url);

	          case 2:
	            servant = _context2.sent;
	            _context2.next = 5;
	            return findServant({ tribe_name: servant.tribe_name, tribe_code: servant.tribe_code });

	          case 5:
	            row = _context2.sent;

	            if (!row) {
	              _context2.next = 17;
	              break;
	            }

	            _logger2.default.verbose('Compare Update Date: new = %j, current = %j', servant.update_date.toUTCString(), row.update_date.toUTCString());

	            if (!(servant.update_date <= row.update_date && !force)) {
	              _context2.next = 11;
	              break;
	            }

	            _logger2.default.verbose('Skip Update Servant: id = %s, tribe_name = %s, tribe_code = %s, name = %s', row._id, servant.tribe_name, servant.tribe_code, servant.name);
	            return _context2.abrupt('return');

	          case 11:
	            servant._id = row._id;
	            _logger2.default.info('Update Servant: id = %s, tribe_name = %s, tribe_code = %s, name = %s', servant._id, servant.tribe_name, servant.tribe_code, servant.name);
	            _context2.next = 15;
	            return updateServant(servant);

	          case 15:
	            _context2.next = 20;
	            break;

	          case 17:
	            _logger2.default.info('Create Servant: tribe_name = %s, tribe_code = %s, name = %s', servant.tribe_name, servant.tribe_code, servant.name);
	            _context2.next = 20;
	            return insertServant(servant);

	          case 20:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, this);
	  }));
	}

	function findServant(args) {
	  return models.servant.findOne(args).exec();
	}

	function insertServant(args) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
	    var result, _id;

	    return regeneratorRuntime.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            _context3.next = 2;
	            return models.counter.getNewId('servant');

	          case 2:
	            result = _context3.sent.result;
	            _id = result.value.seq;
	            _context3.next = 6;
	            return models.servant.update({ _id: _id }, args, { upsert: true }).exec();

	          case 6:
	          case 'end':
	            return _context3.stop();
	        }
	      }
	    }, _callee3, this);
	  }));
	}

	function updateServant(args) {
	  var _id = args._id;
	  delete args._id;
	  return models.servant.update({ _id: _id }, args, { upsert: true }).exec();
	}

	function getServantUrls() {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
	    var $, urls;
	    return regeneratorRuntime.wrap(function _callee4$(_context4) {
	      while (1) {
	        switch (_context4.prev = _context4.next) {
	          case 0:
	            _context4.next = 2;
	            return scraper.fetchAllServantList();

	          case 2:
	            $ = _context4.sent.$;
	            urls = [];

	            $('#content_1001_1').next().next().find('table tbody tr').each(function () {
	              //let tribeParams = getTribeParam($(this).find('td:nth-child(3)').text())
	              //if (tribeParams[0] < tribe_id) {
	              //  return
	              //}
	              //if (tribeParams[0] === tribe_id && tribeParams[2] < tribe_code) {
	              //  return
	              //}
	              urls.push('http://wiki.4gamer.net' + $(this).find('td:nth-child(2) a').attr('href'));
	            });
	            return _context4.abrupt('return', urls);

	          case 6:
	          case 'end':
	            return _context4.stop();
	        }
	      }
	    }, _callee4, this);
	  }));
	}

	function getServantWithUrl(url) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee5() {
	    var $, section1, section2, table1, table2, table3, table4, tribeParams, servant, status, skill;
	    return regeneratorRuntime.wrap(function _callee5$(_context5) {
	      while (1) {
	        switch (_context5.prev = _context5.next) {
	          case 0:
	            _context5.next = 2;
	            return scraper.fetch(url);

	          case 2:
	            $ = _context5.sent.$;
	            section1 = $('#content_1001_1');
	            section2 = $('#content_1001_2');
	            table1 = $('.servant_table > div:nth-child(1) table');
	            table2 = $('.servant_table > div:nth-child(2) table');
	            table3 = section1.nextAll('.table-type-1').first().find('table');
	            table4 = section2.nextAll('.table-type-1').first().find('table');
	            tribeParams = getTribeParam(table1.find('tr:nth-child(1) td:nth-child(2)').text());
	            servant = {};

	            servant.tribe_id = tribeParams[0];
	            servant.tribe_name = tribeParams[1];
	            servant.tribe_code = tribeParams[2];
	            servant.name = $('#page-main-title').text().replace(/[（\(][^）\)]*[）\)]/i, '').trim();
	            servant.type = table1.find('tr:nth-child(1) td:nth-child(4)').text().trim();
	            servant.cost = Number(table1.find('tr:nth-child(2) td:nth-child(2)').text());
	            servant.range = Number(table1.find('tr:nth-child(2) td:nth-child(4)').text().replace(/^.*[（\(]([^）\)]*)[）\)].*$/i, '$1'));
	            servant.release_date = parseDateString($('.servant_table').prev().text().trim().replace(/^.*：([^\/\s]+).*：.*$/i, '$1'));
	            servant.update_date = parseDateString($('.servant_table').prev().text().trim().replace(/^.*：.*：(\d+)$/i, '$1'));
	            servant.illustration_by = table1.find('tr:nth-child(3) td:nth-child(2)').text().trim();
	            servant.character_voice = table1.find('tr:nth-child(3) td:nth-child(4)').text().trim();
	            servant.oral_tradition = $('#content_1001_0').next().text();

	            status = { 1: {}, 20: {} };

	            status[1].hp = Number(table2.find('tr:nth-child(2) td:nth-child(2)').text());
	            status[1].ap = Number(table2.find('tr:nth-child(3) td:nth-child(2)').text());
	            status[1].atk = Number(table2.find('tr:nth-child(4) td:nth-child(2)').text());
	            status[1].pow = Number(table2.find('tr:nth-child(5) td:nth-child(2)').text());
	            status[1].def = Number(table2.find('tr:nth-child(6) td:nth-child(2)').text());
	            status[1].res = Number(table2.find('tr:nth-child(7) td:nth-child(2)').text());
	            status[1].ms = Number(table2.find('tr:nth-child(8) td:nth-child(2)').text());
	            status[1].as = Number(table2.find('tr:nth-child(9) td:nth-child(2)').text());
	            status[20].hp = Number(table2.find('tr:nth-child(2) td:nth-child(3)').text());
	            status[20].ap = Number(table2.find('tr:nth-child(3) td:nth-child(3)').text());
	            status[20].atk = Number(table2.find('tr:nth-child(4) td:nth-child(3)').text());
	            status[20].pow = Number(table2.find('tr:nth-child(5) td:nth-child(3)').text());
	            status[20].def = Number(table2.find('tr:nth-child(6) td:nth-child(3)').text());
	            status[20].res = Number(table2.find('tr:nth-child(7) td:nth-child(3)').text());
	            status[20].ms = Number(table2.find('tr:nth-child(8) td:nth-child(2)').text());
	            status[20].as = Number(table2.find('tr:nth-child(9) td:nth-child(3)').text());
	            servant.status = status;

	            skill = { active: null, passive: null };

	            if (section1[0]) {
	              skill.active = {};
	              skill.active.name = section1.text().split('：')[1].trim();
	              skill.active.description = section1.nextAll('p').first().text().replace(/<br\s*\/?>/gi, "\n").trim();
	              skill.active.designation = table3.find('tr:nth-child(1) td:nth-child(2)').text().replace(/[・･]/ig, ',').trim();
	              skill.active.effect = table3.find('tr:nth-child(1) td:nth-child(4)').text().replace(/[・･]/ig, ',').trim();
	              skill.active.ap = table3.find('tr:nth-child(2) td:nth-child(2)').text().replace(/\s*\/\s*/ig, ',').trim().split(',');
	              skill.active.cd = table3.find('tr:nth-child(2) td:nth-child(4)').text().replace(/\s*\/\s*/ig, ',').trim().split(',');
	            }
	            if (section2[0]) {
	              skill.passive = {};
	              skill.passive.name = section2.text().split('：')[1].trim();
	              skill.passive.description = section2.nextAll('p').first().text().replace(/<br\s*\/?>/gi, "\n").trim();
	              skill.passive.designation = table4.find('tr:nth-child(1) td:nth-child(2)').text().replace(/[・･]/ig, ',').trim();
	              skill.passive.effect = table4.find('tr:nth-child(1) td:nth-child(4)').text().replace(/[・･]/ig, ',').trim();
	              skill.passive.ap = [];
	              skill.passive.cd = [];
	            }
	            servant.skill = skill;

	            servant = fixServant(servant);

	            return _context5.abrupt('return', servant);

	          case 47:
	          case 'end':
	            return _context5.stop();
	        }
	      }
	    }, _callee5, this);
	  }));
	}

	function parseDateString(input) {
	  var date = new Date(Date.UTC(Number(input.slice(0, 4)), Number(input.slice(4, 6)) - 1, Number(input.slice(6, 8))));
	  if (!isNaN(date.valueOf())) {
	    return date;
	  }
	  switch (input) {
	    case 'α1':
	      input = '20141017';break;
	    case 'α2':
	      input = '20141222';break;
	    case 'CBT':
	      input = '20150421';break;
	    case 'OBT':
	      input = '20150604';break;
	    case '正式':
	      input = '20150617';break;
	    default:
	      _logger2.default.warn('Invalid Date: input = %s', input);
	      break;
	  }
	  return new Date(Date.UTC(Number(input.slice(0, 4)), Number(input.slice(4, 6)) - 1, Number(input.slice(6, 8))));
	}

	function getTribeParam(input) {
	  var args = input.split('-');
	  return [[, '人獣', '神族', '魔種', '海種', '不死'].indexOf(args[0]), args[0], Number(args[1])];
	}

	function fixServant(servant) {
	  // adjust name
	  servant.name = servant.name.replace('―', 'ー');

	  // fix servant tribe
	  if (servant.name === 'カイナッツォ') {
	    servant.tribe_name = '海種';
	    servant.tribe_id = 4;
	    servant.tribe_code = 4;
	  }
	  if (servant.name === 'シェラハ') {
	    servant.tribe_name = '海種';
	    servant.tribe_id = 4;
	    servant.tribe_code = 20;
	  }
	  if (servant.name === '水銀燈') {
	    servant.tribe_name = '不死';
	    servant.tribe_id = 5;
	    servant.tribe_code = 46;
	  }

	  // adjust illustration_by
	  if (servant.illustration_by === '―') {
	    servant.illustration_by = null;
	  }
	  // adjust character_voice
	  if (servant.character_voice === '―') {
	    servant.character_voice = null;
	  }
	  // fix skill
	  var _arr = ['active', 'passive'];
	  for (var _i = 0; _i < _arr.length; _i++) {
	    var type = _arr[_i];
	    if (!servant.skill[type]) {
	      continue;
	    }
	    if (['スキルなし', 'なし'].indexOf(servant.skill[type].name) > -1) {
	      servant.skill[type] = null;
	      continue;
	    }
	    if (servant.skill[type].ap.length !== 3) {
	      servant.skill[type].ap = [];
	    }
	    if (servant.skill[type].cd.length !== 3) {
	      servant.skill[type].cd = [];
	    }
	    if (servant.skill[type].designation === '―') {
	      servant.skill[type].designation = null;
	    }
	  }
	  // fix status
	  var _arr2 = [1, 20];
	  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
	    var level = _arr2[_i2];
	    if (!servant.status[level]) {
	      continue;
	    }
	    if (isNaN(servant.status[level].hp)) {
	      servant.status[level] = null;
	    }
	  }
	  return servant;
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("co");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _winston = __webpack_require__(8);

	var _winston2 = _interopRequireDefault(_winston);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var logger = new _winston2.default.Logger({
	  transports: [new _winston2.default.transports.Console({ level: 'silly', timestamp: true })]
	});
	logger.cli();

	exports.default = logger;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("winston");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fetch = fetch;
	exports.fetchArticle = fetchArticle;
	exports.fetchNotice = fetchNotice;
	exports.fetchServant = fetchServant;
	exports.fetchAllServantList = fetchAllServantList;
	exports.fetchServantRanking = fetchServantRanking;
	exports.fetchSpellRanking = fetchSpellRanking;

	var _cheerioHttpcli = __webpack_require__(10);

	var _cheerioHttpcli2 = _interopRequireDefault(_cheerioHttpcli);

	var _logger = __webpack_require__(7);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// set ua
	_cheerioHttpcli2.default.setBrowser('chrome');
	_cheerioHttpcli2.default.headers['User-Agent'] += ' Lova Scraper Client/1.0.0';

	var lovaSiteBasePath = 'http://lova.jp/';
	var cacheSiteBasePath = 'http://cache.lova.jp/';
	var wikiSiteBasePath = 'http://wiki.4gamer.net/lova/';

	function fetch(url) {
	  _logger2.default.verbose('Fetch Url: url = %s', url);
	  return _cheerioHttpcli2.default.fetch(url);
	}

	function fetchArticle(id) {
	  var url = lovaSiteBasePath + 'member/article.php';
	  if (id) {
	    url += '?no=' + id;
	  }
	  return fetch(url);
	}

	function fetchNotice(page) {
	  var url = lovaSiteBasePath + 'member/notice.php';
	  if (page) {
	    url += '?p=' + page;
	  }
	  return fetch(url);
	}

	function fetchServant(tribe_name, name) {
	  if (['ミミララ・レイア', 'ジャンヌ・ダルク'].indexOf(name) > -1) {
	    name = name.replace('・', '');
	  }
	  var url = wikiSiteBasePath + '%E4%BD%BF%E3%81%84%E9%AD%94/' + encodeURIComponent(tribe_name) + '/' + encodeURIComponent(name);
	  return fetch(url);
	}

	function fetchAllServantList() {
	  var url = wikiSiteBasePath + '%E4%BD%BF%E3%81%84%E9%AD%94';
	  return fetch(url);
	}

	function fetchServantRanking(date, mode, map, queue) {
	  var d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	  d.setUTCDate(d.getUTCDate() + 1);
	  var dateString = d.getUTCFullYear() + ('00' + (d.getUTCMonth() + 1)).slice(-2) + ('00' + d.getUTCDate()).slice(-2) + '0500';
	  var path = undefined;
	  switch (mode) {
	    case 'win':
	      path = 'servantWinRate_weekly';
	      break;
	    case 'used':
	      path = 'servantUsedRate_weekly';
	      break;
	  }
	  switch (map) {
	    case 'all':
	      path += '_all';
	      break;
	    case 'vermilion':
	      path += '_7vs7';
	      break;
	    case 'braze':
	      path += '_5vs5';
	      break;
	  }
	  switch (queue) {
	    case 'all':
	      path += '_all';
	      break;
	    case 'normal':
	      path += '_normal';
	      break;
	    case 'solo':
	      path += '_league';
	      break;
	  }
	  path += '_all';
	  var url = cacheSiteBasePath + 'ranking/' + path + '/' + dateString + '/page1.json';
	  return fetch(url);
	}

	function fetchSpellRanking(date, map, queue) {
	  var d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	  d.setUTCDate(d.getUTCDate() + 1);
	  var dateString = d.getUTCFullYear() + ('00' + (d.getUTCMonth() + 1)).slice(-2) + ('00' + d.getUTCDate()).slice(-2) + '0500';
	  var path = 'ultimatespell_weekly';
	  switch (map) {
	    case 'all':
	      path += '_all';
	      break;
	    case 'vermilion':
	      path += '_7vs7';
	      break;
	    case 'braze':
	      path += '_5vs5';
	      break;
	  }
	  switch (queue) {
	    case 'all':
	      path += '_all';
	      break;
	    case 'normal':
	      path += '_normal';
	      break;
	    case 'solo':
	      path += '_league';
	      break;
	  }
	  path += '_all';
	  var url = cacheSiteBasePath + 'ranking/' + path + '/' + dateString + '/page1.json';
	  return fetch(url);
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("cheerio-httpcli");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.spellRanking = exports.servantRanking = exports.prize = exports.servant = exports.counter = undefined;

	var _counter = __webpack_require__(12);

	Object.defineProperty(exports, 'counter', {
	  enumerable: true,
	  get: function get() {
	    return _counter.default;
	  }
	});

	var _servant = __webpack_require__(13);

	Object.defineProperty(exports, 'servant', {
	  enumerable: true,
	  get: function get() {
	    return _servant.default;
	  }
	});

	var _prize = __webpack_require__(14);

	Object.defineProperty(exports, 'prize', {
	  enumerable: true,
	  get: function get() {
	    return _prize.default;
	  }
	});

	var _servantRanking = __webpack_require__(15);

	Object.defineProperty(exports, 'servantRanking', {
	  enumerable: true,
	  get: function get() {
	    return _servantRanking.default;
	  }
	});

	var _spellRanking = __webpack_require__(16);

	Object.defineProperty(exports, 'spellRanking', {
	  enumerable: true,
	  get: function get() {
	    return _spellRanking.default;
	  }
	});

	var _fs = __webpack_require__(17);

	var _fs2 = _interopRequireDefault(_fs);

	var _url = __webpack_require__(18);

	var _url2 = _interopRequireDefault(_url);

	var _mongoose = __webpack_require__(2);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _logger = __webpack_require__(7);

	var _logger2 = _interopRequireDefault(_logger);

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

	var uri = _url2.default.format({
	  protocol: protocol + ':',
	  slashes: true,
	  auth: user && pass ? user + ':' + pass : null,
	  hostname: host,
	  port: port,
	  pathname: '/' + db
	});

	_mongoose2.default.connect(uri);

	_mongoose2.default.connection.on('connected', function () {
	  _logger2.default.info('Mongoose default connection open to ' + uri);
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(2);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;

	var CounterSchema = new Schema({
	  _id: String,
	  seq: Number
	});

	CounterSchema.statics.getNewId = function (name, callback) {
	  var _this = this;

	  return new Promise(function (resolve, reject) {
	    _this.collection.findAndModify({ _id: name }, [], { $inc: { seq: 1 } }, { new: true, upsert: true }, function (err, result) {
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(2);

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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(2);

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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(2);

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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(2);

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
/* 17 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (force) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
	    var prizes, date, results, summary;
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.next = 2;
	            return getPrizes();

	          case 2:
	            prizes = _context.sent;

	            if (prizes.length) {
	              _context.next = 5;
	              break;
	            }

	            throw new Error('Prize is Nothing');

	          case 5:
	            if (force) {
	              _context.next = 13;
	              break;
	            }

	            date = prizes[0].date;
	            _context.next = 9;
	            return findPrizes({ date: date });

	          case 9:
	            results = _context.sent;

	            if (!results.length) {
	              _context.next = 13;
	              break;
	            }

	            _logger2.default.verbose('Prize is Almost Exists: date = %s', date.toUTCString());
	            return _context.abrupt('return');

	          case 13:
	            summary = prizes.reduce(function (p, c) {
	              return p + c.rate * 100;
	            }, 0) / 100;

	            _logger2.default[summary === 1 ? 'info' : 'warn']('Total Rate Summary: summary = %s', summary.toFixed(2));

	            // clean prizes
	            _logger2.default.info('Truncate Prizes');
	            _context.next = 18;
	            return truncatePrizes();

	          case 18:

	            // insert prizes
	            _logger2.default.info('Insert Prizes: count = %d', prizes.length);
	            _context.next = 21;
	            return insertPrizes(prizes);

	          case 21:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this);
	  }));
	};

	var _co = __webpack_require__(6);

	var _co2 = _interopRequireDefault(_co);

	var _logger = __webpack_require__(7);

	var _logger2 = _interopRequireDefault(_logger);

	var _scraper = __webpack_require__(9);

	var scraper = _interopRequireWildcard(_scraper);

	var _models = __webpack_require__(11);

	var models = _interopRequireWildcard(_models);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	var fetchMaxPage = 5;

	function findPrizes(args) {
	  return models.prize.find(args).exec();
	}

	function insertPrizes(prizes) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
	    var i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, prize;

	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            i = 0;
	            _iteratorNormalCompletion = true;
	            _didIteratorError = false;
	            _iteratorError = undefined;
	            _context2.prev = 4;
	            _iterator = prizes[Symbol.iterator]();

	          case 6:
	            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	              _context2.next = 14;
	              break;
	            }

	            prize = _step.value;

	            prize._id = ++i;
	            _context2.next = 11;
	            return insertPrize(prize);

	          case 11:
	            _iteratorNormalCompletion = true;
	            _context2.next = 6;
	            break;

	          case 14:
	            _context2.next = 20;
	            break;

	          case 16:
	            _context2.prev = 16;
	            _context2.t0 = _context2['catch'](4);
	            _didIteratorError = true;
	            _iteratorError = _context2.t0;

	          case 20:
	            _context2.prev = 20;
	            _context2.prev = 21;

	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }

	          case 23:
	            _context2.prev = 23;

	            if (!_didIteratorError) {
	              _context2.next = 26;
	              break;
	            }

	            throw _iteratorError;

	          case 26:
	            return _context2.finish(23);

	          case 27:
	            return _context2.finish(20);

	          case 28:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, this, [[4, 16, 20, 28], [21,, 23, 27]]);
	  }));
	}

	function insertPrize(args) {
	  var _id = args._id;
	  delete args._id;
	  return models.prize.update({ _id: _id }, args, { upsert: true }).exec();
	}

	function truncatePrizes() {
	  return models.prize.remove({}).exec();
	}

	function getPrizes() {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
	    var id, $, panel, text, matches, date, prizes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, matchText, ms;

	    return regeneratorRuntime.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            _context3.next = 2;
	            return getRecentPrizeArticleId();

	          case 2:
	            id = _context3.sent;

	            if (id) {
	              _context3.next = 5;
	              break;
	            }

	            throw new Error('Prize Notice is Not Found');

	          case 5:
	            _context3.next = 7;
	            return scraper.fetchArticle(id);

	          case 7:
	            $ = _context3.sent.$;
	            panel = $('#mainpanel');
	            text = panel.find('div.subsection_frame').text();
	            matches = text.match(/・([^：]+)：([^%％]+)[%％]/gi);

	            if (matches.length) {
	              _context3.next = 13;
	              break;
	            }

	            return _context3.abrupt('return', []);

	          case 13:
	            date = new Date(panel.find('div.article_title span.date').text());

	            date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	            prizes = [];
	            _iteratorNormalCompletion2 = true;
	            _didIteratorError2 = false;
	            _iteratorError2 = undefined;
	            _context3.prev = 19;

	            for (_iterator2 = matches[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	              matchText = _step2.value;
	              ms = matchText.match(/・([^：]+)：([^%％]+)[%％]/i);

	              if (ms) {
	                prizes.push({
	                  date: date,
	                  name: ms[1].trim(),
	                  rate: ms[2].trim() / 100
	                });
	              }
	            }
	            _context3.next = 27;
	            break;

	          case 23:
	            _context3.prev = 23;
	            _context3.t0 = _context3['catch'](19);
	            _didIteratorError2 = true;
	            _iteratorError2 = _context3.t0;

	          case 27:
	            _context3.prev = 27;
	            _context3.prev = 28;

	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }

	          case 30:
	            _context3.prev = 30;

	            if (!_didIteratorError2) {
	              _context3.next = 33;
	              break;
	            }

	            throw _iteratorError2;

	          case 33:
	            return _context3.finish(30);

	          case 34:
	            return _context3.finish(27);

	          case 35:
	            return _context3.abrupt('return', prizes);

	          case 36:
	          case 'end':
	            return _context3.stop();
	        }
	      }
	    }, _callee3, this, [[19, 23, 27, 35], [28,, 30, 34]]);
	  }));
	}

	function getRecentPrizeArticleId() {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
	    var _this = this;

	    var _loop, i, _ret;

	    return regeneratorRuntime.wrap(function _callee4$(_context5) {
	      while (1) {
	        switch (_context5.prev = _context5.next) {
	          case 0:
	            _loop = regeneratorRuntime.mark(function _loop(i) {
	              var $, id;
	              return regeneratorRuntime.wrap(function _loop$(_context4) {
	                while (1) {
	                  switch (_context4.prev = _context4.next) {
	                    case 0:
	                      _context4.next = 2;
	                      return scraper.fetchNotice(i);

	                    case 2:
	                      $ = _context4.sent.$;
	                      id = undefined;

	                      $('#information_panel').find('div.tab_topics ul.page_inner li a').each(function () {
	                        var title = $(this).find('span:last-child').text();
	                        if (title.match(/「転成儀」.*更新のお知らせ/i)) {
	                          id = $(this).attr('href').split('no=')[1];
	                          return false;
	                        }
	                      });

	                      if (!id) {
	                        _context4.next = 7;
	                        break;
	                      }

	                      return _context4.abrupt('return', {
	                        v: id
	                      });

	                    case 7:
	                    case 'end':
	                      return _context4.stop();
	                  }
	                }
	              }, _loop, _this);
	            });
	            i = 1;

	          case 2:
	            if (!(i <= fetchMaxPage)) {
	              _context5.next = 10;
	              break;
	            }

	            return _context5.delegateYield(_loop(i), 't0', 4);

	          case 4:
	            _ret = _context5.t0;

	            if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
	              _context5.next = 7;
	              break;
	            }

	            return _context5.abrupt('return', _ret.v);

	          case 7:
	            i++;
	            _context5.next = 2;
	            break;

	          case 10:
	            return _context5.abrupt('return', null);

	          case 11:
	          case 'end':
	            return _context5.stop();
	        }
	      }
	    }, _callee4, this);
	  }));
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (date, dateFrom, dateTo, force) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
	    var from, to, _d, _d2, servantMap, d, _arr, _i, mode, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, map, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, queue;

	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            from = undefined, to = undefined;

	            if (!date) {
	              _context.next = 9;
	              break;
	            }

	            _d = new Date(date);

	            _d = new Date(Date.UTC(_d.getUTCFullYear(), _d.getUTCMonth(), _d.getUTCDate()));

	            if (!isNaN(_d.valueOf())) {
	              _context.next = 6;
	              break;
	            }

	            throw new Error('Invalid Date: ' + date);

	          case 6:
	            from = to = _d;
	            _context.next = 23;
	            break;

	          case 9:
	            if (!(dateFrom && dateTo)) {
	              _context.next = 20;
	              break;
	            }

	            from = new Date(dateFrom);
	            from = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));

	            if (!isNaN(from.valueOf())) {
	              _context.next = 14;
	              break;
	            }

	            throw new Error('Invalid Date: ' + dateFrom);

	          case 14:
	            to = new Date(dateTo);
	            to = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));

	            if (!isNaN(to.valueOf())) {
	              _context.next = 18;
	              break;
	            }

	            throw new Error('Invalid Date: ' + dateTo);

	          case 18:
	            _context.next = 23;
	            break;

	          case 20:
	            // today if empty
	            _d2 = new Date();

	            _d2 = new Date(Date.UTC(_d2.getUTCFullYear(), _d2.getUTCMonth(), _d2.getUTCDate()));
	            from = to = _d2;

	          case 23:
	            _context.next = 25;
	            return getServantMap();

	          case 25:
	            servantMap = _context.sent;
	            d = from;

	          case 27:
	            if (!(d <= to)) {
	              _context.next = 88;
	              break;
	            }

	            _arr = ['win', 'used'];
	            _i = 0;

	          case 30:
	            if (!(_i < _arr.length)) {
	              _context.next = 85;
	              break;
	            }

	            mode = _arr[_i];
	            _iteratorNormalCompletion = true;
	            _didIteratorError = false;
	            _iteratorError = undefined;
	            _context.prev = 35;
	            _iterator = maps[Symbol.iterator]();

	          case 37:
	            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	              _context.next = 68;
	              break;
	            }

	            map = _step.value;
	            _iteratorNormalCompletion2 = true;
	            _didIteratorError2 = false;
	            _iteratorError2 = undefined;
	            _context.prev = 42;
	            _iterator2 = queues[Symbol.iterator]();

	          case 44:
	            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
	              _context.next = 51;
	              break;
	            }

	            queue = _step2.value;
	            _context.next = 48;
	            return updateRanking(d, mode, map, queue, servantMap, force);

	          case 48:
	            _iteratorNormalCompletion2 = true;
	            _context.next = 44;
	            break;

	          case 51:
	            _context.next = 57;
	            break;

	          case 53:
	            _context.prev = 53;
	            _context.t0 = _context['catch'](42);
	            _didIteratorError2 = true;
	            _iteratorError2 = _context.t0;

	          case 57:
	            _context.prev = 57;
	            _context.prev = 58;

	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }

	          case 60:
	            _context.prev = 60;

	            if (!_didIteratorError2) {
	              _context.next = 63;
	              break;
	            }

	            throw _iteratorError2;

	          case 63:
	            return _context.finish(60);

	          case 64:
	            return _context.finish(57);

	          case 65:
	            _iteratorNormalCompletion = true;
	            _context.next = 37;
	            break;

	          case 68:
	            _context.next = 74;
	            break;

	          case 70:
	            _context.prev = 70;
	            _context.t1 = _context['catch'](35);
	            _didIteratorError = true;
	            _iteratorError = _context.t1;

	          case 74:
	            _context.prev = 74;
	            _context.prev = 75;

	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }

	          case 77:
	            _context.prev = 77;

	            if (!_didIteratorError) {
	              _context.next = 80;
	              break;
	            }

	            throw _iteratorError;

	          case 80:
	            return _context.finish(77);

	          case 81:
	            return _context.finish(74);

	          case 82:
	            _i++;
	            _context.next = 30;
	            break;

	          case 85:
	            d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
	            _context.next = 27;
	            break;

	          case 88:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[35, 70, 74, 82], [42, 53, 57, 65], [58,, 60, 64], [75,, 77, 81]]);
	  }));
	};

	var _co = __webpack_require__(6);

	var _co2 = _interopRequireDefault(_co);

	var _logger = __webpack_require__(7);

	var _logger2 = _interopRequireDefault(_logger);

	var _scraper = __webpack_require__(9);

	var scraper = _interopRequireWildcard(_scraper);

	var _models = __webpack_require__(11);

	var models = _interopRequireWildcard(_models);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var maps = ['all', 'vermilion', 'braze'];
	var queues = ['all', 'normal', 'solo'];

	function updateRanking(date, mode, map, queue, servantMap, force) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
	    var results, rankings, data, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, d;

	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            _logger2.default.verbose('Update Servant Ranking Begin: date = %s (%s, %s, %s)', date.toUTCString(), mode, map, queue);

	            _context2.next = 3;
	            return findRanking({ date: date, mode: mode, map: map, queue: queue });

	          case 3:
	            results = _context2.sent;

	            if (!results.length) {
	              _context2.next = 11;
	              break;
	            }

	            if (force) {
	              _context2.next = 8;
	              break;
	            }

	            _logger2.default.verbose('Servant Ranking is Almost Exists');
	            return _context2.abrupt('return');

	          case 8:

	            // delete
	            _logger2.default.info('Delete Servant Ranking');
	            _context2.next = 11;
	            return deleteRanking({ date: date, mode: mode, map: map, queue: queue });

	          case 11:
	            _context2.next = 13;
	            return getRanking(date, mode, map, queue);

	          case 13:
	            rankings = _context2.sent;

	            if (rankings) {
	              _context2.next = 17;
	              break;
	            }

	            _logger2.default.warn('Servant Ranking Data is Nothing');
	            return _context2.abrupt('return');

	          case 17:
	            data = rankings.map(function (ranking) {
	              return {
	                date: date,
	                mode: mode,
	                map: map,
	                queue: queue,
	                servant_id: servantMap[ranking.tribe][Number(ranking.id)],
	                seq: ranking.seq,
	                rank: ranking.rank,
	                score: ranking.score
	              };
	            });

	            // insert

	            _logger2.default.info('Insert Servant Ranking');
	            _iteratorNormalCompletion3 = true;
	            _didIteratorError3 = false;
	            _iteratorError3 = undefined;
	            _context2.prev = 22;
	            _iterator3 = data[Symbol.iterator]();

	          case 24:
	            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
	              _context2.next = 31;
	              break;
	            }

	            d = _step3.value;
	            _context2.next = 28;
	            return insertRanking(d);

	          case 28:
	            _iteratorNormalCompletion3 = true;
	            _context2.next = 24;
	            break;

	          case 31:
	            _context2.next = 37;
	            break;

	          case 33:
	            _context2.prev = 33;
	            _context2.t0 = _context2['catch'](22);
	            _didIteratorError3 = true;
	            _iteratorError3 = _context2.t0;

	          case 37:
	            _context2.prev = 37;
	            _context2.prev = 38;

	            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	              _iterator3.return();
	            }

	          case 40:
	            _context2.prev = 40;

	            if (!_didIteratorError3) {
	              _context2.next = 43;
	              break;
	            }

	            throw _iteratorError3;

	          case 43:
	            return _context2.finish(40);

	          case 44:
	            return _context2.finish(37);

	          case 45:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, this, [[22, 33, 37, 45], [38,, 40, 44]]);
	  }));
	}

	function findRanking(args) {
	  return models.servantRanking.find(args).exec();
	}

	function deleteRanking(args) {
	  return models.servantRanking.remove(args).exec();
	}

	function insertRanking(args) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
	    var result, _id;

	    return regeneratorRuntime.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            _context3.next = 2;
	            return models.counter.getNewId('servantranking');

	          case 2:
	            result = _context3.sent.result;
	            _id = result.value.seq;
	            _context3.next = 6;
	            return models.servantRanking.update({ _id: _id }, args, { upsert: true }).exec();

	          case 6:
	          case 'end':
	            return _context3.stop();
	        }
	      }
	    }, _callee3, this);
	  }));
	}

	function getRanking(date, mode, map, queue) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
	    var body;
	    return regeneratorRuntime.wrap(function _callee4$(_context4) {
	      while (1) {
	        switch (_context4.prev = _context4.next) {
	          case 0:
	            _context4.next = 2;
	            return scraper.fetchServantRanking(date, mode, map, queue);

	          case 2:
	            body = _context4.sent.body;
	            return _context4.abrupt('return', JSON.parse(body.match(/^\w+\((.*)\);$/i)[1]));

	          case 4:
	          case 'end':
	            return _context4.stop();
	        }
	      }
	    }, _callee4, this);
	  })).then(null, function () {
	    return null;
	  });
	}

	function getServantMap() {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee5() {
	    var servants, map, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, servant, tribeName;

	    return regeneratorRuntime.wrap(function _callee5$(_context5) {
	      while (1) {
	        switch (_context5.prev = _context5.next) {
	          case 0:
	            _context5.next = 2;
	            return models.servant.find({}).exec();

	          case 2:
	            servants = _context5.sent;
	            map = {};
	            _iteratorNormalCompletion4 = true;
	            _didIteratorError4 = false;
	            _iteratorError4 = undefined;
	            _context5.prev = 7;

	            for (_iterator4 = servants[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	              servant = _step4.value;
	              tribeName = getTribeName(servant.tribe_id);

	              if (!map[tribeName]) {
	                map[tribeName] = {};
	              }
	              map[tribeName][servant.tribe_code] = servant._id;
	            }
	            _context5.next = 15;
	            break;

	          case 11:
	            _context5.prev = 11;
	            _context5.t0 = _context5['catch'](7);
	            _didIteratorError4 = true;
	            _iteratorError4 = _context5.t0;

	          case 15:
	            _context5.prev = 15;
	            _context5.prev = 16;

	            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	              _iterator4.return();
	            }

	          case 18:
	            _context5.prev = 18;

	            if (!_didIteratorError4) {
	              _context5.next = 21;
	              break;
	            }

	            throw _iteratorError4;

	          case 21:
	            return _context5.finish(18);

	          case 22:
	            return _context5.finish(15);

	          case 23:
	            return _context5.abrupt('return', servants.reduce(function (previous, current) {
	              var tribeName = getTribeName(current.tribe_id);
	              if (!previous[tribeName]) {
	                previous[tribeName] = {};
	              }
	              previous[tribeName][current.tribe_code] = current._id;
	              return previous;
	            }, {}));

	          case 24:
	          case 'end':
	            return _context5.stop();
	        }
	      }
	    }, _callee5, this, [[7, 11, 15, 23], [16,, 18, 22]]);
	  }));
	}

	function getTribeName(tribeId) {
	  return [, 'bst', 'hly', 'dvl', 'sea', 'und'][tribeId];
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (date, dateFrom, dateTo, force) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
	    var from, to, _d, _d2, d, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, map, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, queue;

	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            from = undefined, to = undefined;

	            if (!date) {
	              _context.next = 9;
	              break;
	            }

	            _d = new Date(date);

	            _d = new Date(Date.UTC(_d.getUTCFullYear(), _d.getUTCMonth(), _d.getUTCDate()));

	            if (!isNaN(_d.valueOf())) {
	              _context.next = 6;
	              break;
	            }

	            throw new Error('Invalid Date: ' + date);

	          case 6:
	            from = to = _d;
	            _context.next = 23;
	            break;

	          case 9:
	            if (!(dateFrom && dateTo)) {
	              _context.next = 20;
	              break;
	            }

	            from = new Date(dateFrom);
	            from = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));

	            if (!isNaN(from.valueOf())) {
	              _context.next = 14;
	              break;
	            }

	            throw new Error('Invalid Date: ' + dateFrom);

	          case 14:
	            to = new Date(dateTo);
	            to = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));

	            if (!isNaN(to.valueOf())) {
	              _context.next = 18;
	              break;
	            }

	            throw new Error('Invalid Date: ' + dateTo);

	          case 18:
	            _context.next = 23;
	            break;

	          case 20:
	            // today if empty
	            _d2 = new Date();

	            _d2 = new Date(Date.UTC(_d2.getUTCFullYear(), _d2.getUTCMonth(), _d2.getUTCDate()));
	            from = to = _d2;

	          case 23:
	            d = from;

	          case 24:
	            if (!(d <= to)) {
	              _context.next = 78;
	              break;
	            }

	            _iteratorNormalCompletion = true;
	            _didIteratorError = false;
	            _iteratorError = undefined;
	            _context.prev = 28;
	            _iterator = maps[Symbol.iterator]();

	          case 30:
	            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	              _context.next = 61;
	              break;
	            }

	            map = _step.value;
	            _iteratorNormalCompletion2 = true;
	            _didIteratorError2 = false;
	            _iteratorError2 = undefined;
	            _context.prev = 35;
	            _iterator2 = queues[Symbol.iterator]();

	          case 37:
	            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
	              _context.next = 44;
	              break;
	            }

	            queue = _step2.value;
	            _context.next = 41;
	            return updateRanking(d, map, queue, force);

	          case 41:
	            _iteratorNormalCompletion2 = true;
	            _context.next = 37;
	            break;

	          case 44:
	            _context.next = 50;
	            break;

	          case 46:
	            _context.prev = 46;
	            _context.t0 = _context['catch'](35);
	            _didIteratorError2 = true;
	            _iteratorError2 = _context.t0;

	          case 50:
	            _context.prev = 50;
	            _context.prev = 51;

	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }

	          case 53:
	            _context.prev = 53;

	            if (!_didIteratorError2) {
	              _context.next = 56;
	              break;
	            }

	            throw _iteratorError2;

	          case 56:
	            return _context.finish(53);

	          case 57:
	            return _context.finish(50);

	          case 58:
	            _iteratorNormalCompletion = true;
	            _context.next = 30;
	            break;

	          case 61:
	            _context.next = 67;
	            break;

	          case 63:
	            _context.prev = 63;
	            _context.t1 = _context['catch'](28);
	            _didIteratorError = true;
	            _iteratorError = _context.t1;

	          case 67:
	            _context.prev = 67;
	            _context.prev = 68;

	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }

	          case 70:
	            _context.prev = 70;

	            if (!_didIteratorError) {
	              _context.next = 73;
	              break;
	            }

	            throw _iteratorError;

	          case 73:
	            return _context.finish(70);

	          case 74:
	            return _context.finish(67);

	          case 75:
	            d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
	            _context.next = 24;
	            break;

	          case 78:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[28, 63, 67, 75], [35, 46, 50, 58], [51,, 53, 57], [68,, 70, 74]]);
	  }));
	};

	var _co = __webpack_require__(6);

	var _co2 = _interopRequireDefault(_co);

	var _logger = __webpack_require__(7);

	var _logger2 = _interopRequireDefault(_logger);

	var _scraper = __webpack_require__(9);

	var scraper = _interopRequireWildcard(_scraper);

	var _models = __webpack_require__(11);

	var models = _interopRequireWildcard(_models);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var maps = ['all', 'vermilion', 'braze'];
	var queues = ['all', 'normal', 'solo'];

	function updateRanking(date, map, queue, force) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
	    var results, rankings, data, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, d;

	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            _logger2.default.verbose('Update Spell Ranking Begin: date = %s (%s, %s)', date.toUTCString(), map, queue);

	            _context2.next = 3;
	            return findRanking({ date: date, map: map, queue: queue });

	          case 3:
	            results = _context2.sent;

	            if (!results.length) {
	              _context2.next = 11;
	              break;
	            }

	            if (force) {
	              _context2.next = 8;
	              break;
	            }

	            _logger2.default.verbose('Spell Ranking is Almost Exists');
	            return _context2.abrupt('return');

	          case 8:

	            // delete
	            _logger2.default.info('Delete Spell Ranking');
	            _context2.next = 11;
	            return deleteRanking({ date: date, map: map, queue: queue });

	          case 11:
	            _context2.next = 13;
	            return getRanking(date, map, queue);

	          case 13:
	            rankings = _context2.sent;

	            if (rankings) {
	              _context2.next = 17;
	              break;
	            }

	            _logger2.default.warn('Spell Ranking Data is Nothing');
	            return _context2.abrupt('return');

	          case 17:
	            data = rankings.map(function (ranking) {
	              return {
	                date: date,
	                map: map,
	                queue: queue,
	                spell_id: getSpellIdWithName(ranking.name),
	                seq: ranking.seq,
	                rank: ranking.rank,
	                score: ranking.score
	              };
	            });

	            // insert

	            _logger2.default.info('Insert Ranking Ranking');
	            _iteratorNormalCompletion3 = true;
	            _didIteratorError3 = false;
	            _iteratorError3 = undefined;
	            _context2.prev = 22;
	            _iterator3 = data[Symbol.iterator]();

	          case 24:
	            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
	              _context2.next = 31;
	              break;
	            }

	            d = _step3.value;
	            _context2.next = 28;
	            return insertRanking(d);

	          case 28:
	            _iteratorNormalCompletion3 = true;
	            _context2.next = 24;
	            break;

	          case 31:
	            _context2.next = 37;
	            break;

	          case 33:
	            _context2.prev = 33;
	            _context2.t0 = _context2['catch'](22);
	            _didIteratorError3 = true;
	            _iteratorError3 = _context2.t0;

	          case 37:
	            _context2.prev = 37;
	            _context2.prev = 38;

	            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	              _iterator3.return();
	            }

	          case 40:
	            _context2.prev = 40;

	            if (!_didIteratorError3) {
	              _context2.next = 43;
	              break;
	            }

	            throw _iteratorError3;

	          case 43:
	            return _context2.finish(40);

	          case 44:
	            return _context2.finish(37);

	          case 45:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, this, [[22, 33, 37, 45], [38,, 40, 44]]);
	  }));
	}

	function findRanking(args) {
	  return models.spellRanking.find(args).exec();
	}

	function deleteRanking(args) {
	  return models.spellRanking.remove(args).exec();
	}

	function insertRanking(args) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
	    var result, _id;

	    return regeneratorRuntime.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            _context3.next = 2;
	            return models.counter.getNewId('spellranking');

	          case 2:
	            result = _context3.sent.result;
	            _id = result.value.seq;
	            _context3.next = 6;
	            return models.spellRanking.update({ _id: _id }, args, { upsert: true }).exec();

	          case 6:
	          case 'end':
	            return _context3.stop();
	        }
	      }
	    }, _callee3, this);
	  }));
	}

	function getRanking(date, map, queue) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
	    var body;
	    return regeneratorRuntime.wrap(function _callee4$(_context4) {
	      while (1) {
	        switch (_context4.prev = _context4.next) {
	          case 0:
	            _context4.next = 2;
	            return scraper.fetchSpellRanking(date, map, queue);

	          case 2:
	            body = _context4.sent.body;
	            return _context4.abrupt('return', JSON.parse(body.match(/^\w+\((.*)\);$/i)[1]));

	          case 4:
	          case 'end':
	            return _context4.stop();
	        }
	      }
	    }, _callee4, this);
	  })).then(null, function () {
	    return null;
	  });
	}

	function getSpellIdWithName(name) {
	  return [, 'キュアオール', 'リターンゲート', 'パワーライズ', 'クイックドライブ', 'リザレクション', 'フォースフィールド', 'クレアボヤンス', 'クロノフリーズ', 'リモートサモン'].indexOf(name);
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _servant = __webpack_require__(23);

	Object.defineProperty(exports, 'servant', {
	  enumerable: true,
	  get: function get() {
	    return _servant.default;
	  }
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (id, force) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
	    var servants, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, servant;

	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            servants = undefined;

	            if (!id) {
	              _context.next = 7;
	              break;
	            }

	            _context.next = 4;
	            return findServants({ _id: id });

	          case 4:
	            servants = _context.sent;
	            _context.next = 10;
	            break;

	          case 7:
	            _context.next = 9;
	            return findServants({});

	          case 9:
	            servants = _context.sent;

	          case 10:
	            _iteratorNormalCompletion = true;
	            _didIteratorError = false;
	            _iteratorError = undefined;
	            _context.prev = 13;
	            _iterator = servants[Symbol.iterator]();

	          case 15:
	            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	              _context.next = 22;
	              break;
	            }

	            servant = _step.value;
	            _context.next = 19;
	            return save(servant, force);

	          case 19:
	            _iteratorNormalCompletion = true;
	            _context.next = 15;
	            break;

	          case 22:
	            _context.next = 28;
	            break;

	          case 24:
	            _context.prev = 24;
	            _context.t0 = _context['catch'](13);
	            _didIteratorError = true;
	            _iteratorError = _context.t0;

	          case 28:
	            _context.prev = 28;
	            _context.prev = 29;

	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }

	          case 31:
	            _context.prev = 31;

	            if (!_didIteratorError) {
	              _context.next = 34;
	              break;
	            }

	            throw _iteratorError;

	          case 34:
	            return _context.finish(31);

	          case 35:
	            return _context.finish(28);

	          case 36:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[13, 24, 28, 36], [29,, 31, 35]]);
	  }));
	};

	var _co = __webpack_require__(6);

	var _co2 = _interopRequireDefault(_co);

	var _fs = __webpack_require__(17);

	var _fs2 = _interopRequireDefault(_fs);

	var _request = __webpack_require__(25);

	var _request2 = _interopRequireDefault(_request);

	var _logger = __webpack_require__(7);

	var _logger2 = _interopRequireDefault(_logger);

	var _scraper = __webpack_require__(9);

	var scraper = _interopRequireWildcard(_scraper);

	var _models = __webpack_require__(11);

	var models = _interopRequireWildcard(_models);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var lwip = null;
	if (!process.env.OPENSHIFT_APP_DNS) {
	  lwip = __webpack_require__(26);
	}

	var imageDir = './public/assets/img/';

	function findServants(args) {
	  return models.servant.find(args).sort({ _id: 1 }).exec();
	}

	function save(servant, force) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
	    var clipImagePath, largeImagePath, middleImagePath, clipUrl, url;
	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            _logger2.default.verbose('Begin Download Servant Image: id = %d', servant.id);

	            clipImagePath = imageDir + 'clip/' + servant.id + '.jpg';
	            largeImagePath = imageDir + 'l/' + servant.id + '.jpg';
	            middleImagePath = imageDir + 'm/' + servant.id + '.jpg';
	            _context2.t2 = !force;

	            if (!_context2.t2) {
	              _context2.next = 9;
	              break;
	            }

	            _context2.next = 8;
	            return exists(clipImagePath);

	          case 8:
	            _context2.t2 = _context2.sent;

	          case 9:
	            _context2.t1 = _context2.t2;

	            if (!_context2.t1) {
	              _context2.next = 14;
	              break;
	            }

	            _context2.next = 13;
	            return exists(largeImagePath);

	          case 13:
	            _context2.t1 = _context2.sent;

	          case 14:
	            _context2.t0 = _context2.t1;

	            if (!_context2.t0) {
	              _context2.next = 19;
	              break;
	            }

	            _context2.next = 18;
	            return exists(middleImagePath);

	          case 18:
	            _context2.t0 = _context2.sent;

	          case 19:
	            if (!_context2.t0) {
	              _context2.next = 22;
	              break;
	            }

	            _logger2.default.verbose('Image File is Almost Exists');
	            return _context2.abrupt('return');

	          case 22:
	            _context2.next = 24;
	            return getClipImageUrlWithServant(servant);

	          case 24:
	            clipUrl = _context2.sent;
	            _context2.next = 27;
	            return getImageUrlWithServant(servant);

	          case 27:
	            url = _context2.sent;

	            if (!(!clipUrl || !url)) {
	              _context2.next = 30;
	              break;
	            }

	            throw new Error('Image Url is Not Found');

	          case 30:
	            _context2.next = 32;
	            return download(clipUrl, clipImagePath);

	          case 32:
	            _context2.next = 34;
	            return download(url, largeImagePath);

	          case 34:
	            _context2.next = 36;
	            return scale(largeImagePath, middleImagePath, 150 / 640);

	          case 36:
	            _context2.next = 38;
	            return compress(middleImagePath, middleImagePath, { quality: 50 });

	          case 38:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, this);
	  }));
	}

	function getImageUrlWithServant(servant) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
	    var $;
	    return regeneratorRuntime.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            _context3.next = 2;
	            return scraper.fetchServant(servant.tribe_name, servant.name);

	          case 2:
	            $ = _context3.sent.$;
	            return _context3.abrupt('return', $('#rendered-body').find('> div:first-child img').attr('src'));

	          case 4:
	          case 'end':
	            return _context3.stop();
	        }
	      }
	    }, _callee3, this);
	  }));
	}

	function getClipImageUrlWithServant(servant) {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
	    var $, tribeNameAndCode;
	    return regeneratorRuntime.wrap(function _callee4$(_context4) {
	      while (1) {
	        switch (_context4.prev = _context4.next) {
	          case 0:
	            _context4.next = 2;
	            return scraper.fetchAllServantList();

	          case 2:
	            $ = _context4.sent.$;
	            tribeNameAndCode = servant.tribe_name + '-' + _.padLeft(servant.tribe_code, 3, 0);
	            return _context4.abrupt('return', $('#content_1001_1').next().next().find('table tbody tr td:contains(' + tribeNameAndCode + ')').prev().prev().find('a img').attr('src'));

	          case 5:
	          case 'end':
	            return _context4.stop();
	        }
	      }
	    }, _callee4, this);
	  }));
	}

	function exists(path) {
	  return new Promise(function (resolve) {
	    _fs2.default.stat(path, function (err) {
	      if (err == null) {
	        resolve(true);
	        return;
	      }
	      resolve(false);
	    });
	  });
	}

	function download(url, path) {
	  return new Promise(function (resolve) {
	    _logger2.default.verbose('Download Image: url = %s', url);

	    _request2.default.get(url)
	    //.on('response', function(res) {
	    //  console.log('statusCode: ', res.statusCode)
	    //  console.log('content-length: ', res.headers['content-length'])
	    //})
	    .pipe(_fs2.default.createWriteStream(path).on('close', function () {
	      resolve();
	    }));
	  });
	}

	function scale(orgPath, distPath, ratio) {
	  return new Promise(function (resolve) {
	    lwip.open(orgPath, function (err, image) {
	      image.batch().scale(ratio, ratio, 'lanczos').writeFile(distPath, 'jpg', {}, function (err) {
	        if (err) {
	          reject(err);
	          return;
	        }
	        resolve();
	      });
	    });
	  });
	}

	function compress(orgPath, distPath, params) {
	  return new Promise(function (resolve) {
	    lwip.open(orgPath, function (err, image) {
	      image.toBuffer('jpg', { quality: 50 }, function (err, buffer) {
	        lwip.open(buffer, 'jpg', function (err, image) {
	          image.writeFile(distPath, 'jpg', {}, function (err) {
	            if (err) {
	              reject(err);
	              return;
	            }
	            resolve();
	          });
	        });
	      });
	    });
	  });
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)))

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("lwip");

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _servant = __webpack_require__(28);

	Object.defineProperty(exports, 'servant', {
	  enumerable: true,
	  get: function get() {
	    return _servant.default;
	  }
	});

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
	    var servants, tribes, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, servant, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, tribeId;

	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.next = 2;
	            return findServants({});

	          case 2:
	            servants = _context.sent;
	            tribes = new Map();
	            _iteratorNormalCompletion = true;
	            _didIteratorError = false;
	            _iteratorError = undefined;
	            _context.prev = 7;

	            for (_iterator = servants[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	              servant = _step.value;

	              if (!tribes.has(servant.tribe_id)) {
	                tribes.set(servant.tribe_id, []);
	              }
	              tribes.get(servant.tribe_id).push(servant);
	            }

	            _context.next = 15;
	            break;

	          case 11:
	            _context.prev = 11;
	            _context.t0 = _context['catch'](7);
	            _didIteratorError = true;
	            _iteratorError = _context.t0;

	          case 15:
	            _context.prev = 15;
	            _context.prev = 16;

	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }

	          case 18:
	            _context.prev = 18;

	            if (!_didIteratorError) {
	              _context.next = 21;
	              break;
	            }

	            throw _iteratorError;

	          case 21:
	            return _context.finish(18);

	          case 22:
	            return _context.finish(15);

	          case 23:
	            _iteratorNormalCompletion2 = true;
	            _didIteratorError2 = false;
	            _iteratorError2 = undefined;
	            _context.prev = 26;
	            _iterator2 = tribes.keys()[Symbol.iterator]();

	          case 28:
	            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
	              _context.next = 39;
	              break;
	            }

	            tribeId = _step2.value;

	            _logger2.default.verbose('Create Servant Clip Sprite Image: tribe_id = %d', tribeId);
	            _context.next = 33;
	            return createClipSpriteWithTribe(tribeId, tribes.get(tribeId));

	          case 33:
	            _logger2.default.verbose('Create Servant Sprite Image: tribe_id = %d', tribeId);
	            _context.next = 36;
	            return createSpriteWithTribe(tribeId, tribes.get(tribeId));

	          case 36:
	            _iteratorNormalCompletion2 = true;
	            _context.next = 28;
	            break;

	          case 39:
	            _context.next = 45;
	            break;

	          case 41:
	            _context.prev = 41;
	            _context.t1 = _context['catch'](26);
	            _didIteratorError2 = true;
	            _iteratorError2 = _context.t1;

	          case 45:
	            _context.prev = 45;
	            _context.prev = 46;

	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }

	          case 48:
	            _context.prev = 48;

	            if (!_didIteratorError2) {
	              _context.next = 51;
	              break;
	            }

	            throw _iteratorError2;

	          case 51:
	            return _context.finish(48);

	          case 52:
	            return _context.finish(45);

	          case 53:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[7, 11, 15, 23], [16,, 18, 22], [26, 41, 45, 53], [46,, 48, 52]]);
	  }));
	};

	var _co = __webpack_require__(6);

	var _co2 = _interopRequireDefault(_co);

	var _fs = __webpack_require__(17);

	var _fs2 = _interopRequireDefault(_fs);

	var _request = __webpack_require__(25);

	var _request2 = _interopRequireDefault(_request);

	var _logger = __webpack_require__(7);

	var _logger2 = _interopRequireDefault(_logger);

	var _scraper = __webpack_require__(9);

	var scraper = _interopRequireWildcard(_scraper);

	var _models = __webpack_require__(11);

	var models = _interopRequireWildcard(_models);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var lwip = null;
	if (!process.env.OPENSHIFT_APP_DNS) {
	  lwip = __webpack_require__(26);
	}

	var imageDir = './public/assets/img/';

	function findServants(args) {
	  return models.servant.find(args).sort({ _id: 1 }).exec();
	}

	function createClipSpriteWithTribe(tribeId, servants) {
	  return new Promise(function (resolve, reject) {
	    var max = servants.reduce(function (previous, current) {
	      return Math.max(current.tribe_code, previous);
	    }, 0);
	    lwip.create(40 * max, 40, { r: 0, g: 0, b: 0 }, function (err, image) {
	      (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
	        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _servant;

	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                image = image.batch();
	                _iteratorNormalCompletion3 = true;
	                _didIteratorError3 = false;
	                _iteratorError3 = undefined;
	                _context2.prev = 4;
	                _iterator3 = servants[Symbol.iterator]();

	              case 6:
	                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
	                  _context2.next = 14;
	                  break;
	                }

	                _servant = _step3.value;
	                _context2.next = 10;
	                return pasteSprite(image, _servant);

	              case 10:
	                image = _context2.sent;

	              case 11:
	                _iteratorNormalCompletion3 = true;
	                _context2.next = 6;
	                break;

	              case 14:
	                _context2.next = 20;
	                break;

	              case 16:
	                _context2.prev = 16;
	                _context2.t0 = _context2['catch'](4);
	                _didIteratorError3 = true;
	                _iteratorError3 = _context2.t0;

	              case 20:
	                _context2.prev = 20;
	                _context2.prev = 21;

	                if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                  _iterator3.return();
	                }

	              case 23:
	                _context2.prev = 23;

	                if (!_didIteratorError3) {
	                  _context2.next = 26;
	                  break;
	                }

	                throw _iteratorError3;

	              case 26:
	                return _context2.finish(23);

	              case 27:
	                return _context2.finish(20);

	              case 28:
	                return _context2.abrupt('return', image);

	              case 29:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this, [[4, 16, 20, 28], [21,, 23, 27]]);
	      })).then(function (image) {
	        image.writeFile(imageDir + 'clip/spr-' + tribeId + '.jpg', 'jpg', function (err) {
	          if (err) {
	            reject(err);
	            return;
	          }
	          resolve();
	        });
	      }, function (err) {
	        reject(err);
	      });
	    });
	  });
	}

	function createSpriteWithTribe(tribeId, servants) {
	  return new Promise(function (resolve, reject) {
	    var max = servants.reduce(function (previous, current) {
	      return Math.max(current.tribe_code, previous);
	    }, 0);
	    lwip.create(150 * max, 890 / 640 * 150, { r: 0, g: 0, b: 0 }, function (err, image) {
	      (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
	        var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _servant2;

	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                image = image.batch();
	                _iteratorNormalCompletion4 = true;
	                _didIteratorError4 = false;
	                _iteratorError4 = undefined;
	                _context3.prev = 4;
	                _iterator4 = servants[Symbol.iterator]();

	              case 6:
	                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
	                  _context3.next = 14;
	                  break;
	                }

	                _servant2 = _step4.value;
	                _context3.next = 10;
	                return paste(image, _servant2);

	              case 10:
	                image = _context3.sent;

	              case 11:
	                _iteratorNormalCompletion4 = true;
	                _context3.next = 6;
	                break;

	              case 14:
	                _context3.next = 20;
	                break;

	              case 16:
	                _context3.prev = 16;
	                _context3.t0 = _context3['catch'](4);
	                _didIteratorError4 = true;
	                _iteratorError4 = _context3.t0;

	              case 20:
	                _context3.prev = 20;
	                _context3.prev = 21;

	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                  _iterator4.return();
	                }

	              case 23:
	                _context3.prev = 23;

	                if (!_didIteratorError4) {
	                  _context3.next = 26;
	                  break;
	                }

	                throw _iteratorError4;

	              case 26:
	                return _context3.finish(23);

	              case 27:
	                return _context3.finish(20);

	              case 28:
	                return _context3.abrupt('return', image);

	              case 29:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this, [[4, 16, 20, 28], [21,, 23, 27]]);
	      })).then(function (image) {
	        image.writeFile(imageDir + 'm/spr-' + tribeId + '.jpg', 'jpg', function (err) {
	          if (err) {
	            reject(err);
	            return;
	          }
	          resolve();
	        });
	      }, function (err) {
	        reject(err);
	      });
	    });
	  });
	}

	function pasteSprite(image, servant) {
	  return new Promise(function (resolve, reject) {
	    var imagePath = imageDir + 'clip/' + servant.id + '.jpg';
	    lwip.open(imagePath, function (err, pasteImage) {
	      if (err) {
	        reject(err);
	        return;
	      }
	      image.paste(40 * (servant.tribe_code - 1), 0, pasteImage);
	      resolve(image);
	    });
	  });
	}

	function paste(image, servant) {
	  return new Promise(function (resolve) {
	    var imagePath = imageDir + 'm/' + servant.id + '.jpg';
	    lwip.open(imagePath, function (err, pasteImage) {
	      if (err) {
	        reject(err);
	        return;
	      }
	      image.paste(150 * (servant.tribe_code - 1), 0, pasteImage);
	      resolve(image);
	    });
	  });
	}

/***/ }
/******/ ]);
//# sourceMappingURL=cli.js.map