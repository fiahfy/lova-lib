/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    var MainController = (function () {
        function MainController() {
            this.now = new Date();
        }
        MainController.$inject = [];
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
        AboutController.$inject = [];
        return AboutController;
    })();
    lova.AboutController = AboutController;
})(lova || (lova = {}));
//# sourceMappingURL=controllers.js.map