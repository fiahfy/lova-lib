/// <reference path="_all.ts" />
'use strict';
var lova;
(function (lova) {
    var MainController = (function () {
        function MainController() {
            this.now = new Date();
        }
        return MainController;
    })();
    lova.MainController = MainController;
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
                { key: 0, icon: 'fui-list-columned' },
                { key: 1, icon: 'fui-list-large-thumbnails' }
            ];
            this.raceIdOptions = [
                { key: null, value: 'Select Race...' },
                { key: 1, value: '人獣' },
                { key: 2, value: '神族' },
                { key: 3, value: '魔種' },
                { key: 4, value: '海種' },
                { key: 5, value: '不死' }
            ];
            this.filter = {
                raceId: undefined,
                name: undefined
            };
            this.predicate = ['raceId', 'raceCode'];
            this.reverse = false;
            this.view = $routeParams.view ? +$routeParams.view : 0;
            this.raceId = $routeParams.race_id ? +$routeParams.race_id : 0;
            this.filter.raceId = this.raceId ? this.raceId : undefined;
            servantService.load()
                .then(function () {
                _this.servants = servantService.servants;
                _this.scrollService.restore();
                _this.refreshEventListener();
            });
            $scope.$watch(function () { return _this.raceId; }, function (newValue, oldValue) {
                if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
                    return;
                }
                _this.selectRaceId(_this.raceId);
            }, true);
        }
        ServantListController.prototype.selectView = function (view) {
            this.$location.url(this.$location.search('view', view).url());
        };
        ServantListController.prototype.selectRaceId = function (raceId) {
            this.$location.url(this.$location.search('race_id', raceId).url());
        };
        ServantListController.prototype.changeQuery = function () {
            this.filter.name = this.q;
            this.refreshEventListener();
        };
        ServantListController.prototype.openServant = function (servant) {
            this.$location.url('/servants/' + servant.id + '/');
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
    lova.ServantListController = ServantListController;
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
    lova.ServantDetailController = ServantDetailController;
    var DeckController = (function () {
        function DeckController($window, $location, $routeParams, servantService, deckService) {
            var _this = this;
            this.$window = $window;
            this.$location = $location;
            this.$routeParams = $routeParams;
            this.servantService = servantService;
            this.deckService = deckService;
            this.raceIdOptions = [
                { key: null, value: 'Select Race...' },
                { key: 1, value: '人獣' },
                { key: 2, value: '神族' },
                { key: 3, value: '魔種' },
                { key: 4, value: '海種' },
                { key: 5, value: '不死' }
            ];
            this.raceName = 'Select Race...';
            this.filter = {
                raceId: undefined,
                name: undefined
            };
            this.predicate = ['raceId', 'raceCode'];
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
        DeckController.prototype.selectRaceId = function (raceId, raceName) {
            this.raceId = raceId;
            this.raceName = raceName;
            this.filter.raceId = this.raceId ? this.raceId : undefined;
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
    lova.DeckController = DeckController;
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
    lova.PrizeController = PrizeController;
    var AboutController = (function () {
        function AboutController() {
            this.mail = lova.AppConfig.mail;
        }
        return AboutController;
    })();
    lova.AboutController = AboutController;
})(lova || (lova = {}));
/// <reference path="_all.ts" />
'use strict';
var lova;
(function (lova) {
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
    lova.fittable = fittable;
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
                            animation: false,
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
    lova.skillPopover = skillPopover;
    function skillPopoverContent() {
        return {
            restrict: 'E',
            templateUrl: 'templates/elements/skill-popover.html',
            transclude: true,
            replace: true,
            scope: {
                servant: '='
            }
        };
    }
    lova.skillPopoverContent = skillPopoverContent;
})(lova || (lova = {}));
/// <reference path="_all.ts" />
'use strict';
var lova;
(function (lova) {
    function pad() {
        return function (input, length, str) {
            return ((new Array(length + 1)).join(str) + input).slice(-length);
        };
    }
    lova.pad = pad;
    function def() {
        return function (input, value) {
            return (typeof input === 'undefined' || input == null) ? value : input;
        };
    }
    lova.def = def;
    function replace() {
        return function (input, regexp, newSubStr) {
            if (!input) {
                return input;
            }
            var reg = new RegExp(regexp);
            return input.replace(reg, newSubStr);
        };
    }
    lova.replace = replace;
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
    lova.skillDescription = skillDescription;
})(lova || (lova = {}));
/// <reference path="_all.ts" />
'use strict';
var lova;
(function (lova) {
    var ServantModel = (function () {
        function ServantModel(obj) {
            this.id = obj.id;
            this.raceId = obj.race_id;
            this.raceName = obj.race_name;
            this.raceCode = obj.race_code;
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
        Object.defineProperty(ServantModel.prototype, "raceNameAndCode", {
            get: function () {
                return this.raceName + '-' + ('000' + this.raceCode).slice(-3);
            },
            enumerable: true,
            configurable: true
        });
        return ServantModel;
    })();
    lova.ServantModel = ServantModel;
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
    lova.StatusModel = StatusModel;
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
    lova.SkillModel = SkillModel;
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
                var raceIds = [];
                var fill = true;
                this.servants.forEach(function (e, i) {
                    if (DeckModel.deckIndexes.indexOf(i) == -1) {
                        return;
                    }
                    if (!e) {
                        fill = false;
                        return;
                    }
                    if (raceIds.indexOf(e.raceId) == -1) {
                        raceIds.push(e.raceId);
                    }
                });
                if (!fill) {
                    return 0;
                }
                switch (raceIds.length) {
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
    lova.DeckModel = DeckModel;
    var PrizeModel = (function () {
        function PrizeModel(obj) {
            this.id = obj.id;
            this.date = new Date(obj.date);
            this.name = obj.name;
            this.rate = obj.rate;
        }
        return PrizeModel;
    })();
    lova.PrizeModel = PrizeModel;
})(lova || (lova = {}));
/// <reference path="_all.ts" />
'use strict';
var lova;
(function (lova) {
    var app = angular.module('app', [
        'ngRoute',
        'ngTouch',
        'ngDraggable',
        'ui',
        'angulartics', 'angulartics.google.analytics'
    ]);
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
                templateUrl: 'templates/pages/servant.html',
                controller: 'ServantListController',
                controllerAs: 'c'
            }).
                when('/servants/:id/', {
                templateUrl: 'templates/pages/servant/detail.html',
                controller: 'ServantDetailController',
                controllerAs: 'c'
            }).
                when('/deck/', {
                templateUrl: 'templates/pages/deck.html',
                controller: 'DeckController',
                controllerAs: 'c'
            }).
                when('/deck/:hash/', {
                templateUrl: 'templates/pages/deck.html',
                controller: 'DeckController',
                controllerAs: 'c'
            }).
                when('/prize/', {
                templateUrl: 'templates/pages/prize.html',
                controller: 'PrizeController',
                controllerAs: 'c'
            }).
                when('/about/', {
                templateUrl: 'templates/pages/about.html',
                controller: 'AboutController',
                controllerAs: 'c'
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
    lova.AppConfig = AppConfig;
    app.config(Router);
    app.config(Locator);
    app.value('AppConfig', AppConfig);
    app.controller('MainController', lova.MainController);
    app.controller('ServantListController', lova.ServantListController);
    app.controller('ServantDetailController', lova.ServantDetailController);
    app.controller('DeckController', lova.DeckController);
    app.controller('PrizeController', lova.PrizeController);
    app.controller('AboutController', lova.AboutController);
    app.directive('fittable', lova.fittable);
    app.directive('skillPopover', lova.skillPopover);
    app.directive('skillPopoverContent', lova.skillPopoverContent);
    app.filter('pad', lova.pad);
    app.filter('default', lova.def);
    app.filter('replace', lova.replace);
    app.filter('skillDescription', lova.skillDescription);
    app.service('ServantService', lova.ServantService);
    app.service('DeckService', lova.DeckService);
    app.service('PrizeService', lova.PrizeService);
    app.service('ScrollService', lova.ScrollService);
})(lova || (lova = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="controllers.ts" />
/// <reference path="directives.ts" />
/// <reference path="filters.ts" />
/// <reference path="services.ts" />
/// <reference path="models.ts" />
/// <reference path="app.ts" />
/// <reference path="_all.ts" />
'use strict';
var lova;
(function (lova) {
    var ServantService = (function () {
        function ServantService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.servants = [];
        }
        ServantService.prototype.load = function () {
            var _this = this;
            var deferrd = this.$q.defer();
            if (this.servants.length) {
                deferrd.resolve();
                return deferrd.promise;
            }
            this.$http.get(ServantService.url)
                .then(function (res) {
                res.data.forEach(function (servant) {
                    _this.servants.push(new lova.ServantModel(servant));
                });
                deferrd.resolve();
            }, function () {
                deferrd.reject();
            });
            return deferrd.promise;
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
    lova.ServantService = ServantService;
    var DeckService = (function () {
        function DeckService($window) {
            this.$window = $window;
            this.servants = [];
            this.deck = new lova.DeckModel();
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
    lova.DeckService = DeckService;
    var PrizeService = (function () {
        function PrizeService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.prizes = [];
        }
        PrizeService.prototype.load = function () {
            var _this = this;
            var deferrd = this.$q.defer();
            if (this.prizes.length) {
                deferrd.resolve();
                return deferrd.promise;
            }
            this.$http.get(PrizeService.url)
                .then(function (res) {
                res.data.forEach(function (servant) {
                    _this.prizes.push(new lova.PrizeModel(servant));
                });
                deferrd.resolve();
            }, function () {
                deferrd.reject();
            });
            return deferrd.promise;
        };
        PrizeService.url = './api/prizes/';
        PrizeService.$inject = [
            '$http',
            '$q'
        ];
        return PrizeService;
    })();
    lova.PrizeService = PrizeService;
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
    lova.ScrollService = ScrollService;
})(lova || (lova = {}));
//# sourceMappingURL=main.js.map