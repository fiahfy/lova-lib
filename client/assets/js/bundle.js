(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../../typings/tsd.d.ts" />
'use strict';
////import * as angular from 'angular';
//import 'angular-route';
//import 'angular-touch';
////import 'angular-ui-bootstrap';
//import 'angular-ui-select2';
//import 'angulartics';
//import 'angulartics-google-analytics';
////import 'bootstrap';
//import 'jquery-lazyload';
//import 'flat-ui';
//
//import 'google-analytics';
//import 'angular-draggable';
exports.appName = 'app';
exports.modules = [
    'ngRoute',
    'ngTouch',
    'ngDraggable',
    //'ui.bootstrap',
    //'ui.select2',
    'ui',
    'angulartics',
    'angulartics.google.analytics'
];
angular.module(exports.appName, exports.modules);
var Locator = (function () {
    function Locator(locationProvider) {
        locationProvider.html5Mode(true);
    }
    Locator.$inject = [
        '$locationProvider'
    ];
    return Locator;
})();
var Router = (function () {
    function Router(routerProvider) {
        routerProvider.
            when('/servants/', {
            template: '<lova-servant-list></lova-servant-list>'
        }).
            when('/servants/:id/', {
            template: '<lova-servant-detail></lova-servant-detail>'
        }).
            when('/deck/', {
            template: '<lova-deck></lova-deck>'
        }).
            when('/deck/:hash/', {
            template: '<lova-deck></lova-deck>'
        }).
            when('/prize/', {
            template: '<lova-prize></lova-prize>'
        }).
            when('/about/', {
            template: '<lova-about></lova-about>'
        }).
            otherwise({
            redirectTo: '/servants/'
        });
    }
    Router.$inject = [
        '$routeProvider'
    ];
    return Router;
})();
var AppConfig = (function () {
    function AppConfig() {
    }
    AppConfig.mail = 'd.fiahfy@gmail.com';
    return AppConfig;
})();
exports.AppConfig = AppConfig;
angular.module(exports.appName).config(Router);
angular.module(exports.appName).config(Locator);
angular.module(exports.appName).value('AppConfig', AppConfig);
require('./controllers');
require('./directives');
require('./services');
require('./filters');
var FooterController = (function () {
    function FooterController() {
        this.now = new Date();
    }
    return FooterController;
})();
exports.FooterController = FooterController;
angular.module(exports.appName).controller('FooterController', FooterController);

},{"./controllers":4,"./directives":9,"./filters":14,"./services":22}],2:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var AboutController = (function () {
    function AboutController() {
        this.mail = app.AppConfig.mail;
    }
    return AboutController;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: AboutController,
            controllerAs: 'c',
            restrict: 'E',
            templateUrl: '/assets/templates/about.html'
        };
    };
    return Definition;
})();
angular.module('app').directive('lovaAbout', Definition.ddo);

},{"../app":1}],3:[function(require,module,exports){
'use strict';
var DeckController = (function () {
    function DeckController($window, $location, $routeParams, servantService, deckService) {
        var _this = this;
        this.$window = $window;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.servantService = servantService;
        this.deckService = deckService;
        this.tribeIdOptions = [
            { key: 0, value: 'Select Tribe...' },
            { key: 1, value: '人獣' },
            { key: 2, value: '神族' },
            { key: 3, value: '魔種' },
            { key: 4, value: '海種' },
            { key: 5, value: '不死' }
        ];
        this.tribeName = 'Select Tribe...';
        this.filter = {
            tribeId: undefined,
            name: undefined
        };
        this.predicate = ['tribeId', 'tribeCode'];
        this.reverse = false;
        servantService.load()
            .then(function () {
            _this.servants = servantService.servants;
            deckService.servants = servantService.servants;
            deckService.loadWithHash($routeParams.hash);
            _this.deck = deckService.deck;
            _this.url = deckService.url;
            _this.refreshEventListener();
        });
        angular.element($window.document).ready(function () {
            var button = angular.element('.copy-clipboard');
            var clip = new ZeroClipboard(button);
            clip.on('ready', function () {
                clip.on('aftercopy', function () {
                    button
                        .attr('data-original-title', 'Copied')
                        .tooltip('show');
                    $window.setTimeout(function () {
                        button
                            .tooltip('hide')
                            .attr('data-original-title', '');
                    }, 1000);
                });
            });
            button
                .tooltip({
                trigger: 'manual',
                container: 'body'
            });
        });
    }
    DeckController.prototype.setServant = function (index, data) {
        var servantId = data.servantId;
        var oldIndex = data.index;
        if (oldIndex !== null) {
            this.deckService.setServant(oldIndex, this.deck.servants[index] ? this.deck.servants[index].id : undefined);
        }
        this.deckService.setServant(index, servantId);
        this.deck = this.deckService.deck;
        this.url = this.deckService.url;
        this.refreshEventListener();
    };
    DeckController.prototype.clearServant = function (index) {
        this.deckService.unsetServant(index);
        this.deck = this.deckService.deck;
        this.url = this.deckService.url;
        this.refreshEventListener();
    };
    DeckController.prototype.selectTribeId = function (tribeId, tribeName) {
        this.tribeId = tribeId;
        this.tribeName = tribeName;
        this.filter.tribeId = this.tribeId ? this.tribeId : undefined;
        this.refreshEventListener();
    };
    DeckController.prototype.changeQuery = function () {
        this.filter.name = this.q;
        this.refreshEventListener();
    };
    DeckController.prototype.openServant = function (servantId) {
        this.$window.open('/servants/' + servantId + '/', '_blank');
    };
    DeckController.prototype.refreshEventListener = function () {
        this.$window.setTimeout(function () {
            //noinspection TaskProblemsInspection
            angular.element('img.lazy').lazyload();
        }, 1);
    };
    DeckController.$inject = [
        '$window',
        '$location',
        '$routeParams',
        'ServantService',
        'DeckService'
    ];
    return DeckController;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: DeckController,
            controllerAs: 'c',
            restrict: 'E',
            templateUrl: '/assets/templates/deck.html'
        };
    };
    return Definition;
})();
angular.module('app').directive('lovaDeck', Definition.ddo);

},{}],4:[function(require,module,exports){
'use strict';
require('./servant-list');
require('./servant-detail');
require('./deck');
require('./prize');
require('./about');

},{"./about":2,"./deck":3,"./prize":5,"./servant-detail":6,"./servant-list":7}],5:[function(require,module,exports){
'use strict';
var PrizeController = (function () {
    function PrizeController(prizeService) {
        var _this = this;
        this.prizeService = prizeService;
        this.times = 10;
        this.viewOptions = [
            { key: 0, icon: 'fui-list-numbered' },
            { key: 1, icon: 'fui-list-thumbnailed' }
        ];
        this.view = 0;
        prizeService.load()
            .then(function () {
            _this.prizes = prizeService.prizes;
        });
    }
    PrizeController.prototype.drawPrizes = function () {
        this.times = !isNaN(this.times) ? this.times : 10;
        this.times = this.times < 1000 ? this.times : 1000;
        var drawList = [];
        var cn = 0;
        this.prizes.forEach(function (e) {
            cn += e.rate;
            drawList.push({ n: cn, prize: e });
        });
        this.results = [];
        var summary = {};
        for (var i = 0; i < this.times; i++) {
            var r = Math.random() * cn;
            for (var j = 0; j < drawList.length; j++) {
                var draw = drawList[j];
                if (r <= draw.n) {
                    this.results.push(draw.prize);
                    if (summary[draw.prize.id]) {
                        summary[draw.prize.id].count++;
                    }
                    else {
                        summary[draw.prize.id] = {
                            prize: draw.prize, count: 1
                        };
                    }
                    break;
                }
            }
        }
        this.resultTimes = this.times;
        this.resultSummary = [];
        var me = this;
        Object.keys(summary).forEach(function (key) {
            me.resultSummary.push({
                prize: this[key].prize, count: this[key].count
            });
        }, summary);
    };
    PrizeController.prototype.selectView = function (view) {
        this.view = view;
    };
    PrizeController.$inject = [
        'PrizeService'
    ];
    return PrizeController;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: PrizeController,
            controllerAs: 'c',
            restrict: 'E',
            templateUrl: '/assets/templates/prize.html'
        };
    };
    return Definition;
})();
angular.module('app').directive('lovaPrize', Definition.ddo);

},{}],6:[function(require,module,exports){
'use strict';
var ServantDetailController = (function () {
    function ServantDetailController($routeParams, servantService, scrollService) {
        var _this = this;
        this.$routeParams = $routeParams;
        this.servantService = servantService;
        this.scrollService = scrollService;
        servantService.load()
            .then(function () {
            _this.servant = servantService.getServantWithId(+$routeParams.id);
            _this.scrollService.restore();
        });
    }
    ServantDetailController.$inject = [
        '$routeParams',
        'ServantService',
        'ScrollService'
    ];
    return ServantDetailController;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: ServantDetailController,
            controllerAs: 'c',
            restrict: 'E',
            templateUrl: '/assets/templates/servant-detail.html'
        };
    };
    return Definition;
})();
angular.module('app').directive('lovaServantDetail', Definition.ddo);

},{}],7:[function(require,module,exports){
'use strict';
var ServantListController = (function () {
    function ServantListController($scope, $window, $location, $routeParams, servantService, scrollService) {
        var _this = this;
        this.$scope = $scope;
        this.$window = $window;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.servantService = servantService;
        this.scrollService = scrollService;
        this.viewOptions = [
            { key: 0, icon: 'fui-list-large-thumbnails' },
            { key: 1, icon: 'fui-list-columned' }
        ];
        this.tribeIdOptions = [
            { key: 0, value: 'Select Tribe...' },
            { key: 1, value: '人獣' },
            { key: 2, value: '神族' },
            { key: 3, value: '魔種' },
            { key: 4, value: '海種' },
            { key: 5, value: '不死' }
        ];
        this.filter = {
            tribeId: undefined,
            name: undefined,
            type: undefined,
            range: undefined,
            cost: undefined,
            illustrationBy: undefined,
            characterVoice: undefined
        };
        this.predicate = ['tribeId', 'tribeCode'];
        this.reverse = false;
        this.view = $routeParams.view ? +$routeParams.view : 0;
        this.tribeId = $routeParams.tribe_id ? +$routeParams.tribe_id : 0;
        this.q = $routeParams.q ? $routeParams.q : '';
        this.updateFilter();
        servantService.load()
            .then(function () {
            _this.servants = servantService.servants;
            _this.scrollService.restore();
            _this.refreshEventListener();
        });
        $scope.$watch(function () { return _this.tribeId; }, function (newValue, oldValue) {
            if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
                return;
            }
            _this.selectTribeId(_this.tribeId);
        }, true);
    }
    ServantListController.prototype.selectView = function (view) {
        this.$location.url(this.$location.search('view', view).url());
    };
    ServantListController.prototype.selectTribeId = function (tribeId) {
        this.$location.url(this.$location.search('tribe_id', tribeId).url());
    };
    ServantListController.prototype.changeQuery = function () {
        this.updateFilter();
        this.refreshEventListener();
    };
    ServantListController.prototype.openServant = function (servant) {
        this.$location.url('/servants/' + servant.id + '/');
    };
    ServantListController.prototype.updateFilter = function () {
        var _this = this;
        var params = this.parseQuery(this.q);
        Object.keys(this.filter).forEach(function (key) {
            _this.filter[key] = params[key];
        });
        this.filter['tribeId'] = +this.tribeId ? '' + this.tribeId : undefined;
    };
    ServantListController.prototype.parseQuery = function (query) {
        var params = {};
        query.split(/[\s　]/i).forEach(function (e) {
            var _a = e.split(':'), key = _a[0], value = _a[1];
            if (!value) {
                params['name'] = key;
                return;
            }
            params[key] = value.replace('+', ' ');
        });
        return params;
    };
    ServantListController.prototype.refreshEventListener = function () {
        this.$window.setTimeout(function () {
            //noinspection TaskProblemsInspection
            angular.element('img.lazy').lazyload();
        }, 1);
    };
    ServantListController.$inject = [
        '$scope',
        '$window',
        '$location',
        '$routeParams',
        'ServantService',
        'ScrollService'
    ];
    return ServantListController;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: ServantListController,
            controllerAs: 'c',
            restrict: 'E',
            templateUrl: '/assets/templates/servant-list.html'
        };
    };
    return Definition;
})();
angular.module('app').directive('lovaServantList', Definition.ddo);

},{}],8:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function fittable() {
    return {
        restrict: 'A',
        link: function ($scope, element, attributes) {
            var cls = attributes.fittable;
            var elementTop = element.offset().top;
            var dummyWrapper = $('<div>');
            $(window).on('scroll touchmove', function () {
                if ($(window).scrollTop() >= elementTop) {
                    var h = element.outerHeight();
                    element.addClass(cls);
                    element.after(dummyWrapper.height(h));
                    return;
                }
                element.removeClass(cls);
                dummyWrapper.remove();
            });
        }
    };
}
angular.module(app.appName).directive('fittable', fittable);

},{"../app":1}],9:[function(require,module,exports){
'use strict';
require('./fittable');
require('./skill-popover');
require('./skill-popover-content');

},{"./fittable":8,"./skill-popover":11,"./skill-popover-content":10}],10:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function skillPopoverContent() {
    return {
        restrict: 'E',
        templateUrl: '/assets/templates/elements/skill-popover.html',
        transclude: true,
        replace: true,
        scope: {
            servant: '='
        }
    };
}
angular.module(app.appName).directive('skillPopoverContent', skillPopoverContent);

},{"../app":1}],11:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
skillPopover.$inject = [
    '$window'
];
function skillPopover($window) {
    return {
        restrict: 'A',
        scope: {
            skillPopover: '='
        },
        link: function ($scope, element, attributes) {
            var args = $scope.skillPopover;
            // clear all popovers
            angular.element(args.container).empty();
            // attach event listener
            angular.element(element).each((function (window) {
                return function () {
                    var _this = this;
                    angular.element(this)
                        .popover({
                        animation: true,
                        html: true,
                        placement: function () {
                            var top = angular.element(_this).offset().top;
                            if (top - angular.element(window).scrollTop() < angular.element(window).height() / 2) {
                                return 'bottom';
                            }
                            return 'top';
                        },
                        container: args.container,
                        trigger: 'hover',
                        title: args.title,
                        content: function () {
                            return angular.element(_this).parents(args.deck).find(args.content).html();
                        }
                    });
                };
            })($window));
        }
    };
}
angular.module(app.appName).directive('skillPopover', skillPopover);

},{"../app":1}],12:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function def() {
    return function (input, value) {
        return (typeof input === 'undefined' || input == null) ? value : input;
    };
}
angular.module(app.appName).filter('default', def);

},{"../app":1}],13:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function escape() {
    return function (input, type) {
        return encodeURIComponent(input);
    };
}
angular.module(app.appName).filter('escape', escape);
angular.module(app.appName).filter('e', escape);

},{"../app":1}],14:[function(require,module,exports){
'use strict';
require('./default');
require('./escape');
require('./pad');
require('./replace');
require('./skill-description');

},{"./default":12,"./escape":13,"./pad":15,"./replace":16,"./skill-description":17}],15:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function pad() {
    return function (input, length, str) {
        if (input === undefined || input === null) {
            return input;
        }
        return ((new Array(length + 1)).join(str) + input).slice(-length);
    };
}
angular.module(app.appName).filter('pad', pad);

},{"../app":1}],16:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function replace() {
    return function (input, regexp, newSubStr) {
        if (!input) {
            return input;
        }
        var reg = new RegExp(regexp);
        return input.replace(reg, newSubStr);
    };
}
angular.module(app.appName).filter('replace', replace);

},{"../app":1}],17:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function skillDescription($sce) {
    return function (skill) {
        var desc = skill.description;
        if (!desc) {
            return desc;
        }
        desc = desc
            .replace(/(^|\n)\d+\.\s/g, '$1')
            .replace(/\n/g, '<br/><br/>')
            .replace(/［([^］]+)］/g, '<br/>&nbsp;&nbsp;<b>- $1</b>')
            .replace(/：/g, ' : ');
        var cd = skill.cd;
        if (cd && cd.length) {
            cd = '- クールダウン : ' + cd.join(' / ');
            desc = desc.replace(/<br\/>/, '<br/>&nbsp;&nbsp;<b>' + cd + '</b><br/>');
        }
        var ap = skill.ap;
        if (ap && cd.length) {
            ap = '- 消費AP : ' + ap.join(' / ');
            desc = desc.replace(/<br\/>/, '<br/>&nbsp;&nbsp;<b>' + ap + '</b><br/>');
        }
        return $sce.trustAsHtml(desc);
    };
}
angular.module(app.appName).filter('skillDescription', skillDescription);

},{"../app":1}],18:[function(require,module,exports){
'use strict';
var DeckModel = (function () {
    function DeckModel() {
        this.servants = [];
        this.servantIds = [];
    }
    Object.defineProperty(DeckModel.prototype, "hash", {
        get: function () {
            return window.btoa(JSON.stringify(this.servantIds));
        },
        set: function (value) {
            try {
                this.servantIds = JSON.parse(window.atob(value));
            }
            catch (e) {
                this.servantIds = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeckModel.prototype, "mana", {
        get: function () {
            var fill = true;
            this.servants.forEach(function (e, i) {
                if (!e && DeckModel.deckIndexes.indexOf(i) > -1) {
                    fill = false;
                }
            });
            return fill ? 30 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeckModel.prototype, "bonusMana", {
        get: function () {
            var tribeIds = [];
            var fill = true;
            this.servants.forEach(function (e, i) {
                if (DeckModel.deckIndexes.indexOf(i) == -1) {
                    return;
                }
                if (!e) {
                    fill = false;
                    return;
                }
                if (tribeIds.indexOf(e.tribeId) == -1) {
                    tribeIds.push(e.tribeId);
                }
            });
            if (!fill) {
                return 0;
            }
            switch (tribeIds.length) {
                case 1:
                    return 10;
                case 2:
                    return 5;
                default:
                    return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    DeckModel.prototype.updateServants = function (servants) {
        this.servants = [];
        for (var i = 0; i < DeckModel.size; i++) {
            var servantId = this.servantIds[i];
            var tmp = void 0;
            for (var j = 0; j < servants.length; j++) {
                var servant = servants[j];
                if (servantId == servant.id) {
                    tmp = servant;
                    break;
                }
            }
            this.servants.push(tmp);
        }
    };
    DeckModel.deckIndexes = [0, 1, 2, 3, 4, 5];
    DeckModel.sideBoardIndexes = [6, 7];
    DeckModel.size = DeckModel.deckIndexes.length + DeckModel.sideBoardIndexes.length;
    return DeckModel;
})();
exports.DeckModel = DeckModel;

},{}],19:[function(require,module,exports){
'use strict';
var PrizeModel = (function () {
    function PrizeModel(obj) {
        this.id = obj.id;
        this.date = new Date(obj.date);
        this.name = obj.name;
        this.rate = obj.rate;
    }
    return PrizeModel;
})();
exports.PrizeModel = PrizeModel;

},{}],20:[function(require,module,exports){
'use strict';
var ServantModel = (function () {
    function ServantModel(obj) {
        this.id = obj.id;
        this.tribeId = obj.tribe_id;
        this.tribeName = obj.tribe_name;
        this.tribeCode = obj.tribe_code;
        this.type = obj.type;
        this.name = obj.name;
        this.cost = obj.cost;
        this.range = obj.range;
        this.date = new Date(obj.date);
        this.illustrationBy = obj.illustration_by;
        this.characterVoice = obj.character_voice;
        this.oralTradition = obj.oral_tradition;
        this.status = {
            1: obj.status[1] ? new StatusModel(obj.status[1]) : null,
            20: obj.status[20] ? new StatusModel(obj.status[20]) : null
        };
        this.skill = {
            active: obj.skill.active ? new SkillModel(obj.skill.active) : null,
            passive: obj.skill.passive ? new SkillModel(obj.skill.passive) : null
        };
    }
    Object.defineProperty(ServantModel.prototype, "tribeNameAndCode", {
        get: function () {
            return this.tribeName + '-' + ('000' + this.tribeCode).slice(-3);
        },
        enumerable: true,
        configurable: true
    });
    return ServantModel;
})();
exports.ServantModel = ServantModel;
var StatusModel = (function () {
    function StatusModel(obj) {
        this.hp = obj.hp;
        this.ap = obj.ap;
        this.atk = obj.atk;
        this.pow = obj.pow;
        this.def = obj.def;
        this.res = obj.res;
        this.ms = obj.ms;
        this.as = obj.as;
    }
    return StatusModel;
})();
exports.StatusModel = StatusModel;
var SkillModel = (function () {
    function SkillModel(obj) {
        this.name = obj.name;
        this.designation = obj.designation;
        this.effect = obj.effect;
        this.description = obj.description;
        this.ap = obj.ap;
        this.cd = obj.cd;
    }
    return SkillModel;
})();
exports.SkillModel = SkillModel;

},{}],21:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var deck_1 = require('../models/deck');
var DeckService = (function () {
    function DeckService($window) {
        this.$window = $window;
        this.servants = [];
        this.deck = new deck_1.DeckModel();
    }
    Object.defineProperty(DeckService.prototype, "url", {
        get: function () {
            var a = this.$window.document.createElement('a');
            a.href = this.$window.location.href;
            return a.protocol + '//'
                + a.hostname + (a.port ? ':' + a.port : a.port)
                + '/deck/' + this.deck.hash + '/';
        },
        enumerable: true,
        configurable: true
    });
    DeckService.prototype.loadWithHash = function (hash) {
        this.deck.hash = hash;
        this.deck.updateServants(this.servants);
    };
    DeckService.prototype.setServant = function (index, servantId) {
        this.deck.servantIds[index] = servantId;
        this.deck.updateServants(this.servants);
    };
    DeckService.prototype.unsetServant = function (index) {
        this.setServant(index, undefined);
    };
    DeckService.$inject = [
        '$window'
    ];
    return DeckService;
})();
exports.DeckService = DeckService;
angular.module(app.appName).service('DeckService', DeckService);

},{"../app":1,"../models/deck":18}],22:[function(require,module,exports){
'use strict';
require('./servant');
require('./deck');
require('./prize');
require('./scroll');

},{"./deck":21,"./prize":23,"./scroll":24,"./servant":25}],23:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var prize_1 = require('../models/prize');
var PrizeService = (function () {
    function PrizeService($http, $q) {
        this.$http = $http;
        this.$q = $q;
        this.prizes = [];
    }
    PrizeService.prototype.load = function () {
        var _this = this;
        var deferred = this.$q.defer();
        if (this.prizes.length) {
            deferred.resolve();
            return deferred.promise;
        }
        this.$http.get(PrizeService.url)
            .then(function (res) {
            res.data.forEach(function (prize) {
                _this.prizes.push(new prize_1.PrizeModel(prize));
            });
            deferred.resolve();
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    PrizeService.url = './api/prizes/';
    PrizeService.$inject = [
        '$http',
        '$q'
    ];
    return PrizeService;
})();
exports.PrizeService = PrizeService;
angular.module(app.appName).service('PrizeService', PrizeService);

},{"../app":1,"../models/prize":19}],24:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var ScrollService = (function () {
    function ScrollService($location, $window) {
        var _this = this;
        this.$location = $location;
        this.$window = $window;
        this.positions = {};
        angular.element($window).on('scroll', function () {
            _this.positions[_this.$location.path()] = angular.element($window).scrollTop();
        });
    }
    ScrollService.prototype.restore = function () {
        var top = this.positions[this.$location.path()] || 0;
        angular.element(this.$window).scrollTop(top);
    };
    ScrollService.$inject = [
        '$location',
        '$window'
    ];
    return ScrollService;
})();
exports.ScrollService = ScrollService;
angular.module(app.appName).service('ScrollService', ScrollService);

},{"../app":1}],25:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var servant_1 = require('../models/servant');
var ServantService = (function () {
    function ServantService($http, $q) {
        this.$http = $http;
        this.$q = $q;
        this.servants = [];
    }
    ServantService.prototype.load = function () {
        var _this = this;
        var deferred = this.$q.defer();
        if (this.servants.length) {
            deferred.resolve();
            return deferred.promise;
        }
        this.$http.get(ServantService.url)
            .then(function (res) {
            res.data.forEach(function (servant) {
                _this.servants.push(new servant_1.ServantModel(servant));
            });
            deferred.resolve();
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    ServantService.prototype.getServantWithId = function (id) {
        var result = null;
        this.servants.forEach(function (servant) {
            if (servant.id == id) {
                result = servant;
            }
        });
        return result;
    };
    ServantService.url = './api/servants/';
    ServantService.$inject = [
        '$http',
        '$q'
    ];
    return ServantService;
})();
exports.ServantService = ServantService;
angular.module(app.appName).service('ServantService', ServantService);

},{"../app":1,"../models/servant":20}]},{},[1]);
