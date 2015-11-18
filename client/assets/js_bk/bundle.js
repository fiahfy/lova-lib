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
    'angulartics.google.analytics',
    'nvd3'
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
        routerProvider
            .when('/deck/', {
            template: '<lova-deck></lova-deck>'
        })
            .when('/deck/:hash/', {
            template: '<lova-deck></lova-deck>'
        })
            .when('/servants/', {
            template: '<lova-servant-list></lova-servant-list>'
        })
            .when('/servants/:id/', {
            template: '<lova-servant-detail></lova-servant-detail>'
        })
            .when('/charts/', {
            template: '<lova-chart></lova-chart>'
        })
            .when('/prize/', {
            template: '<lova-prize></lova-prize>'
        })
            .when('/about/', {
            template: '<lova-about></lova-about>'
        })
            .otherwise({
            redirectTo: '/deck/'
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
var RootController = (function () {
    function RootController($scope, $location, servantService) {
        var _this = this;
        this.$scope = $scope;
        this.$location = $location;
        this.servantService = servantService;
        this.now = new Date();
        $scope.$on('$routeChangeSuccess', function (event, current, previous) {
            var path = $location.path().match(/^\/(\w+)\//)[1];
            _this.title = (path.charAt(0).toUpperCase() + path.slice(1)) + " : LoVA Tool";
            _this.description = 'Tool Site for Lord of Vermilion Arena';
            switch (path) {
                case 'deck':
                    _this.description = 'Deck Simulator for Lord of Vermilion Arena';
                    return;
                case 'charts':
                    _this.description = 'Charts for Lord of Vermilion Arena';
                    return;
                case 'prize':
                    _this.description = 'Prize Simulator for Lord of Vermilion Arena';
                    return;
                case 'about':
                    return;
                case 'servants':
                    _this.description = 'Servants for Lord of Vermilion Arena';
                    break;
            }
            var matches = $location.path().match(/^\/servants\/(\d+)\//);
            if (!matches) {
                return;
            }
            var id = +matches[1];
            servantService.loadWithId(id)
                .then(function (servant) {
                _this.title = "Servant " + servant.tribeName + "-" + ('000' + servant.tribeCode).slice(-3) + " " + servant.name + " : LoVA Tool";
                _this.description = "" + servant.oralTradition;
            });
        });
    }
    RootController.$inject = [
        '$scope',
        '$location',
        'ServantService'
    ];
    return RootController;
})();
exports.RootController = RootController;
angular.module(exports.appName).controller('RootController', RootController);

},{"./controllers":5,"./directives":10,"./filters":16,"./services":26}],2:[function(require,module,exports){
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
var spell_1 = require('../services/spell');
var ChartController = (function () {
    function ChartController(spellStatisticService) {
        this.spellStatisticService = spellStatisticService;
        this.updateStatistics();
    }
    ChartController.prototype.updateStatistics = function () {
        var _this = this;
        this.spellStatisticService.load('month', 'all', 'all')
            .then(function (statistics) {
            _this.statistics = statistics;
            _this.updateGraph();
        });
    };
    ChartController.prototype.updateGraph = function () {
        var _this = this;
        this.updateDate = null;
        this.graphData = this.statistics.map(function (e) {
            return {
                key: spell_1.SpellService.getSpellNameWithId(e.spellId),
                values: e.data.map(function (statistics) {
                    if (!_this.updateDate || statistics.date.getTime() > _this.updateDate.getTime()) {
                        _this.updateDate = statistics.date;
                    }
                    return { x: statistics.date, y: statistics.score };
                })
            };
        });
        this.graphOptions = {
            chart: {
                type: 'lineChart',
                height: 500,
                margin: {
                    top: 20,
                    right: 30,
                    bottom: 50,
                    left: 50
                },
                transitionDuration: 500,
                interpolate: 'monotone',
                useInteractiveGuideline: true,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format('%Y-%m-%d')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabel: 'Used Rate (%)',
                    tickFormat: function (d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                }
            }
        };
    };
    ChartController.$inject = [
        'SpellStatisticService'
    ];
    return ChartController;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: ChartController,
            controllerAs: 'c',
            restrict: 'E',
            templateUrl: '/assets/templates/chart.html'
        };
    };
    return Definition;
})();
angular.module('app').directive('lovaChart', Definition.ddo);

},{"../services/spell":32}],4:[function(require,module,exports){
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
        this.typeOptions = [
            { key: '', value: 'Select Type...' }
        ];
        this.tribeName = 'Select Tribe...';
        this.type = this.typeOptions[0].value;
        this.filter = {
            tribeId: undefined,
            type: undefined,
            name: undefined
        };
        this.predicate = ['tribeId', 'tribeCode'];
        this.reverse = false;
        servantService.load()
            .then(function (servants) {
            _this.servants = servants;
            _this.deck = deckService.getDeckWithHash($routeParams.hash, servants);
            _this.url = deckService.getUrlWithDeck(_this.deck);
            _this.buildOptions();
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
    DeckController.prototype.buildOptions = function () {
        for (var _i = 0, _a = this.servants; _i < _a.length; _i++) {
            var servant = _a[_i];
            var optionKeys = this.typeOptions.map(function (option) {
                return option.key;
            });
            if (optionKeys.indexOf(servant.type) == -1) {
                this.typeOptions.push({ key: servant.type, value: servant.type });
            }
        }
        // todo: type 毎の total count も表示
    };
    DeckController.prototype.setServant = function (index, data) {
        var servant = data.servant;
        var oldIndex = data.index;
        if (oldIndex !== null) {
            this.deck.servants[oldIndex] = this.deck.servants[index] ? this.deck.servants[index] : undefined;
        }
        this.deck.servants[index] = servant;
        this.url = this.deckService.getUrlWithDeck(this.deck);
    };
    DeckController.prototype.clearServant = function (index) {
        this.deck.servants[index] = undefined;
        this.url = this.deckService.getUrlWithDeck(this.deck);
    };
    DeckController.prototype.selectTribeId = function (tribeId, tribeName) {
        this.tribeId = tribeId;
        this.tribeName = tribeName;
        this.filter.tribeId = this.tribeId ? this.tribeId : undefined;
        this.flashLazyLoad();
    };
    DeckController.prototype.selectType = function (type, typeName) {
        this.type = typeName;
        this.filter.type = type ? type : undefined;
        this.flashLazyLoad();
    };
    DeckController.prototype.changeQuery = function () {
        this.filter.name = this.q;
        this.flashLazyLoad();
    };
    DeckController.prototype.openServant = function (servantId) {
        this.$window.open('/servants/' + servantId + '/', '_blank');
    };
    DeckController.prototype.flashLazyLoad = function () {
        // force call scroll event
        var top = angular.element(this.$window.document).scrollTop();
        angular.element(this.$window.document).scrollTop(top + 1);
        angular.element(this.$window.document).scrollTop(top);
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

},{}],5:[function(require,module,exports){
'use strict';
require('./about');
require('./chart');
require('./deck');
require('./prize');
require('./servant-detail');
require('./servant-list');

},{"./about":2,"./chart":3,"./deck":4,"./prize":6,"./servant-detail":7,"./servant-list":8}],6:[function(require,module,exports){
'use strict';
var PrizeController = (function () {
    function PrizeController(prizeService) {
        var _this = this;
        this.prizeService = prizeService;
        this.viewOptions = [
            { key: 0, icon: 'fui-list-numbered' },
            { key: 1, icon: 'fui-list-thumbnailed' }
        ];
        this.times = 10;
        this.view = 0;
        prizeService.load()
            .then(function (prizes) {
            _this.prizes = prizes;
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

},{}],7:[function(require,module,exports){
'use strict';
var ServantDetailController = (function () {
    function ServantDetailController($window, $routeParams, $location, servantService, servantStatisticService, scrollService) {
        var _this = this;
        this.$window = $window;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.servantService = servantService;
        this.servantStatisticService = servantStatisticService;
        this.scrollService = scrollService;
        this.mapOptions = [
            { key: 'all', value: 'All' },
            { key: 'vermilion', value: 'Vermilion' },
            { key: 'braze', value: 'Braze' }
        ];
        this.queueOptions = [
            { key: 'all', value: 'All' },
            { key: 'normal', value: 'Normal' },
            { key: 'solo', value: 'Solo' }
        ];
        this.map = 'all';
        this.queue = 'all';
        this.graphXAxisTickFormatFunction = function () {
            return function (d) {
                return d3.time.format('%Y-%m-%d')(new Date(d));
            };
        };
        this.graphToolTipContentFunction = function () {
            return function (item) {
                return item.point[1].toFixed(2) + " %";
            };
        };
        this.id = +$routeParams.id;
        this.hash = $location.hash() || 'detail';
        servantService.loadWithId(this.id)
            .then(function (servant) {
            _this.servant = servant;
            _this.scrollService.restore();
        });
        this.updateStatistics();
        angular.element($window.document).ready(function () {
            $window.setTimeout(function () {
                angular.element(':radio')['radiocheck']();
            });
        });
    }
    ServantDetailController.prototype.updateStatistics = function () {
        var _this = this;
        this.servantStatisticService.loadWithId(this.id, 'win', 'month', this.map, this.queue)
            .then(function (statistics) {
            _this.statistics1 = statistics;
            return _this.servantStatisticService.loadWithId(_this.id, 'used', 'month', _this.map, _this.queue);
        })
            .then(function (statistics) {
            _this.statistics2 = statistics;
            _this.updateGraph();
        });
    };
    ServantDetailController.prototype.updateGraph = function () {
        this.graph1Data = [];
        this.graph1Data.push({
            key: 'Win Rate',
            area: true,
            color: '#1f77b4',
            values: this.statistics1.map(function (statistic) {
                return { x: statistic.date, y: statistic.score };
            })
        });
        this.graph1Data.push({
            key: 'Average',
            area: false,
            color: '#ff7f0e',
            values: this.statistics1.map(function (statistic) {
                return { x: statistic.date, y: 50 };
            })
        });
        this.graph2Data = [];
        this.graph2Data.push({
            key: 'Used Rate',
            area: true,
            color: '#9467bd',
            values: this.statistics2.map(function (statistic) {
                return { x: statistic.date, y: statistic.score };
            })
        });
        this.graph2Data.push({
            key: 'Average',
            area: false,
            color: '#ff7f0e',
            values: this.statistics2.map(function (statistic) {
                // TODO: servants count取得
                return { x: statistic.date, y: 100 / 221 };
            })
        });
        this.graph1Options = this.graph2Options = {
            chart: {
                type: 'lineChart',
                height: 350,
                margin: {
                    top: 20,
                    right: 30,
                    bottom: 50,
                    left: 50
                },
                transitionDuration: 500,
                interpolate: 'monotone',
                useInteractiveGuideline: true,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format('%Y-%m-%d')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabel: 'Rate (%)',
                    tickFormat: function (d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                }
            }
        };
    };
    ServantDetailController.$inject = [
        '$window',
        '$routeParams',
        '$location',
        'ServantService',
        'ServantStatisticService',
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

},{}],8:[function(require,module,exports){
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
        this.tribeId = $routeParams.tribe_id ? +$routeParams.tribe_id : 0;
        this.q = $routeParams.q ? $routeParams.q : '';
        this.updateFilter();
        servantService.load()
            .then(function (servants) {
            _this.servants = servants;
            _this.scrollService.restore();
            $window.setTimeout(function () {
                angular.element('table.table').DataTable({
                    paging: false,
                    searching: false,
                    columnDefs: [
                        { orderable: false, targets: 1 },
                        { orderSequence: ['desc', 'asc'], targets: [6, 7, 8, 9] },
                    ]
                });
            });
        });
        $scope.$watch(function () { return _this.tribeId; }, function (newValue, oldValue) {
            if (typeof newValue === 'undefined'
                || typeof oldValue === 'undefined'
                || newValue == oldValue) {
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

},{}],9:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function fittable() {
    return {
        restrict: 'A',
        link: function ($scope, element, attributes) {
            var cls = attributes.lovaFittable;
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
angular.module(app.appName).directive('lovaFittable', fittable);

},{"../app":1}],10:[function(require,module,exports){
'use strict';
require('./fittable');
require('./lazy-image');
require('./skill-popover');
require('./skill-popover-content');

},{"./fittable":9,"./lazy-image":11,"./skill-popover":13,"./skill-popover-content":12}],11:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function lazyImage() {
    return {
        restrict: 'A',
        link: function ($scope, element, attributes) {
            window.setTimeout(function () {
                //noinspection TaskProblemsInspection
                element['lazyload']();
                // todo: 一回目の変更時だけ初期表示がされない(/deck)
            });
        }
    };
}
angular.module(app.appName).directive('lovaLazyImage', lazyImage);

},{"../app":1}],12:[function(require,module,exports){
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
angular.module(app.appName).directive('lovaSkillPopoverContent', skillPopoverContent);

},{"../app":1}],13:[function(require,module,exports){
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
            lovaSkillPopover: '='
        },
        link: function ($scope, element, attributes) {
            var args = $scope.lovaSkillPopover;
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
                            return angular.element(_this).parents(args.card).find(args.content).html();
                        }
                    });
                };
            })($window));
        }
    };
}
angular.module(app.appName).directive('lovaSkillPopover', skillPopover);

},{"../app":1}],14:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
function def() {
    return function (input, value) {
        return (typeof input === 'undefined' || input == null) ? value : input;
    };
}
angular.module(app.appName).filter('default', def);

},{"../app":1}],15:[function(require,module,exports){
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

},{"../app":1}],16:[function(require,module,exports){
'use strict';
require('./default');
require('./escape');
require('./pad');
require('./replace');
require('./skill-description');

},{"./default":14,"./escape":15,"./pad":17,"./replace":18,"./skill-description":19}],17:[function(require,module,exports){
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

},{"../app":1}],18:[function(require,module,exports){
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

},{"../app":1}],19:[function(require,module,exports){
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

},{"../app":1}],20:[function(require,module,exports){
'use strict';
var DeckModel = (function () {
    function DeckModel() {
        this.servants = new Array(DeckModel.size);
    }
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
    Object.defineProperty(DeckModel.prototype, "totalMana", {
        get: function () {
            return this.servants.reduce(function (p, e, i) {
                if (e && DeckModel.deckIndexes.indexOf(i) > -1) {
                    return e.cost + p;
                }
                return p;
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    DeckModel.deckIndexes = [0, 1, 2, 3, 4, 5];
    DeckModel.sideBoardIndexes = [6, 7];
    DeckModel.size = DeckModel.deckIndexes.length + DeckModel.sideBoardIndexes.length;
    return DeckModel;
})();
exports.DeckModel = DeckModel;

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
'use strict';
var ServantStatisticModel = (function () {
    function ServantStatisticModel(obj) {
        this.date = new Date(obj.date);
        this.score = obj.score;
    }
    return ServantStatisticModel;
})();
exports.ServantStatisticModel = ServantStatisticModel;
var ServantStatisticsModel = (function () {
    function ServantStatisticsModel(obj) {
        this.servantId = obj.spell_id;
        this.data = obj.data.map(function (e) {
            return new ServantStatisticModel(e);
        });
    }
    return ServantStatisticsModel;
})();
exports.ServantStatisticsModel = ServantStatisticsModel;

},{}],23:[function(require,module,exports){
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
        this.releaseDate = new Date(obj.release_date);
        this.updateDate = new Date(obj.update_date);
        this.illustrationBy = obj.illustration_by;
        this.characterVoice = obj.character_voice;
        this.oralTradition = obj.oral_tradition;
        this.winRate = obj.win_rate;
        this.usedRate = obj.used_rate;
        if (obj.status) {
            this.status = {
                1: obj.status[1] ? new StatusModel(obj.status[1]) : null,
                20: obj.status[20] ? new StatusModel(obj.status[20]) : null
            };
        }
        if (obj.skill) {
            this.skill = {
                active: obj.skill.active ? new SkillModel(obj.skill.active) : null,
                passive: obj.skill.passive ? new SkillModel(obj.skill.passive) : null
            };
        }
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

},{}],24:[function(require,module,exports){
'use strict';
var SpellStatisticModel = (function () {
    function SpellStatisticModel(obj) {
        this.date = new Date(obj.date);
        this.score = obj.score;
    }
    return SpellStatisticModel;
})();
exports.SpellStatisticModel = SpellStatisticModel;
var SpellStatisticsModel = (function () {
    function SpellStatisticsModel(obj) {
        this.spellId = obj.spell_id;
        this.data = obj.data.map(function (e) {
            return new SpellStatisticModel(e);
        });
    }
    return SpellStatisticsModel;
})();
exports.SpellStatisticsModel = SpellStatisticsModel;

},{}],25:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var deck_1 = require('../models/deck');
var DeckService = (function () {
    function DeckService($window) {
        this.$window = $window;
    }
    DeckService.prototype.getDeckWithHash = function (hash, servants) {
        var deck = new deck_1.DeckModel();
        var servantIds = DeckService.decode(hash);
        for (var i = 0; i < deck_1.DeckModel.size; i++) {
            var servantId = servantIds[i];
            for (var _i = 0; _i < servants.length; _i++) {
                var servant = servants[_i];
                if (servant.id === servantId) {
                    deck.servants[i] = servant;
                    break;
                }
            }
        }
        return deck;
    };
    DeckService.prototype.getUrlWithDeck = function (deck) {
        var servantIds = deck.servants.map(function (servant) {
            return servant ? servant.id : undefined;
        });
        var a = this.$window.document.createElement('a');
        a.href = this.$window.location.href;
        return a.protocol + '//'
            + a.hostname + (a.port ? ':' + a.port : a.port)
            + '/deck/' + DeckService.encode(servantIds) + '/';
    };
    DeckService.encode = function (data) {
        return window.btoa(JSON.stringify(data));
    };
    DeckService.decode = function (encodedString) {
        try {
            return JSON.parse(window.atob(encodedString));
        }
        catch (e) {
            return [];
        }
    };
    DeckService.$inject = [
        '$window'
    ];
    return DeckService;
})();
exports.DeckService = DeckService;
angular.module(app.appName).service('DeckService', DeckService);

},{"../app":1,"../models/deck":20}],26:[function(require,module,exports){
'use strict';
require('./deck');
require('./prize');
require('./scroll');
require('./servant');
require('./servant-statistic');
require('./spell-statistic');

},{"./deck":25,"./prize":27,"./scroll":28,"./servant":30,"./servant-statistic":29,"./spell-statistic":31}],27:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var prize_1 = require('../models/prize');
var PrizeService = (function () {
    function PrizeService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    PrizeService.prototype.load = function () {
        var deferred = this.$q.defer();
        this.$http.get(PrizeService.url, { cache: true })
            .then(function (res) {
            var prizes = [];
            res.data.forEach(function (prize) {
                prizes.push(new prize_1.PrizeModel(prize));
            });
            deferred.resolve(prizes);
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

},{"../app":1,"../models/prize":21}],28:[function(require,module,exports){
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
        var _this = this;
        var top = this.positions[this.$location.path()] || 0;
        // TODO: wait 100ms (not working with 0ms, 1ms)
        this.$window.setTimeout(function () {
            angular.element(_this.$window).scrollTop(top);
        }, 100);
    };
    ScrollService.$inject = [
        '$location',
        '$window'
    ];
    return ScrollService;
})();
exports.ScrollService = ScrollService;
angular.module(app.appName).service('ScrollService', ScrollService);

},{"../app":1}],29:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var servant_statistic_1 = require('../models/servant-statistic');
var ServantStatisticService = (function () {
    function ServantStatisticService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    ServantStatisticService.prototype.loadWithId = function (id, mode, term, map, queue) {
        var deferred = this.$q.defer();
        this.$http.get("" + ServantStatisticService.url + id + "/statistics/?mode=" + mode + "&term=" + term + "&map=" + map + "&queue=" + queue, { cache: true })
            .then(function (res) {
            var statistics = res.data.map(function (e) {
                return new servant_statistic_1.ServantStatisticModel(e);
            });
            deferred.resolve(statistics);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    ServantStatisticService.prototype.load = function (mode, term, map, queue) {
        var deferred = this.$q.defer();
        this.$http.get(ServantStatisticService.url + "statistics/?mode=" + mode + "&term=" + term + "&map=" + map + "&queue=" + queue, { cache: true })
            .then(function (res) {
            var statistics = res.data.map(function (e) {
                return new servant_statistic_1.ServantStatisticsModel(e);
            });
            deferred.resolve(statistics);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    ServantStatisticService.url = './api/servants/';
    ServantStatisticService.$inject = [
        '$http',
        '$q'
    ];
    return ServantStatisticService;
})();
exports.ServantStatisticService = ServantStatisticService;
angular.module(app.appName).service('ServantStatisticService', ServantStatisticService);

},{"../app":1,"../models/servant-statistic":22}],30:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var servant_1 = require('../models/servant');
var ServantService = (function () {
    function ServantService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    ServantService.prototype.load = function () {
        var deferred = this.$q.defer();
        this.$http.get(ServantService.url + "?with_statistic&fields=-oral_tradition", { cache: true })
            .then(function (res) {
            var servants = res.data.map(function (e) {
                return new servant_1.ServantModel(e);
            });
            deferred.resolve(servants);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    ServantService.prototype.loadWithId = function (id) {
        var deferred = this.$q.defer();
        this.$http.get("" + ServantService.url + id + "/", { cache: true })
            .then(function (res) {
            var servant = new servant_1.ServantModel(res.data);
            deferred.resolve(servant);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
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

},{"../app":1,"../models/servant":23}],31:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var spell_statistic_1 = require('../models/spell-statistic');
var SpellStatisticService = (function () {
    function SpellStatisticService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    SpellStatisticService.prototype.load = function (term, map, queue) {
        var deferred = this.$q.defer();
        this.$http.get(SpellStatisticService.url + "statistics/?term=" + term + "&map=" + map + "&queue=" + queue, { cache: true })
            .then(function (res) {
            var statistics = res.data.map(function (e) {
                return new spell_statistic_1.SpellStatisticsModel(e);
            });
            deferred.resolve(statistics);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    SpellStatisticService.url = './api/spells/';
    SpellStatisticService.$inject = [
        '$http',
        '$q'
    ];
    return SpellStatisticService;
})();
exports.SpellStatisticService = SpellStatisticService;
angular.module(app.appName).service('SpellStatisticService', SpellStatisticService);

},{"../app":1,"../models/spell-statistic":24}],32:[function(require,module,exports){
'use strict';
//import * as angular from 'angular';
var app = require('../app');
var SpellService = (function () {
    function SpellService() {
    }
    SpellService.getSpellNameWithId = function (spellId) {
        return [,
            'キュアオール',
            'リターンゲート',
            'パワーライズ',
            'クイックドライブ',
            'リザレクション',
            'フォースフィールド',
            'クレアボヤンス',
            'クロノフリーズ',
            'リモートサモン'
        ][spellId] || 'unknown';
    };
    SpellService.$inject = [];
    return SpellService;
})();
exports.SpellService = SpellService;
angular.module(app.appName).service('SpellService', SpellService);

},{"../app":1}]},{},[1]);
