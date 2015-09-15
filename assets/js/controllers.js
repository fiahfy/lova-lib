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
            this.servants = [];
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
                _this.showServants();
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
            this.$location.url(this.$location.search('race_id', this.raceId).url());
        };
        ServantListController.prototype.changeQuery = function () {
            this.filter.name = this.q;
            this.showServants();
        };
        ServantListController.prototype.openServant = function (servant) {
            this.$location.url('/servants/' + servant.id + '/');
        };
        ServantListController.prototype.showServants = function () {
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
        function DeckController($scope, $window, $location, $routeParams, servantService) {
            var _this = this;
            this.$scope = $scope;
            this.$window = $window;
            this.$location = $location;
            this.$routeParams = $routeParams;
            this.servantService = servantService;
            this.servants = [];
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
            this.deckIds = new Array(8);
            try {
                this.deckIds = this.decode($routeParams.hash);
            }
            catch (e) { }
            servantService.load()
                .then(function () {
                _this.servants = servantService.servants;
                _this.updateDecks();
                _this.updateLink();
                _this.updateEvent();
                _this.showServants();
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
        DeckController.prototype.setServant = function (index, data, event) {
            var servantId = data.servantId;
            var oldIndex = data.index;
            if (oldIndex !== null) {
                this.deckIds[oldIndex] = this.deckIds[index];
            }
            this.deckIds[index] = servantId;
            this.updateDecks();
            this.updateLink();
            this.updateEvent();
        };
        DeckController.prototype.clearServant = function (index) {
            this.deckIds[index] = 0;
            this.updateDecks();
            this.updateLink();
            this.updateEvent();
        };
        DeckController.prototype.selectRaceId = function (raceId, raceName) {
            this.raceId = raceId;
            this.raceName = raceName;
            this.filter.raceId = this.raceId ? this.raceId : undefined;
            this.updateEvent();
            this.showServants();
        };
        DeckController.prototype.changeQuery = function () {
            this.filter.name = this.q;
            this.updateEvent();
            this.showServants();
        };
        DeckController.prototype.showServant = function (servantId) {
            this.$window.open('/lova-tool/#/servants/' + servantId + '/', '_blank');
        };
        DeckController.prototype.showServants = function () {
            this.$window.setTimeout(function () {
                //noinspection TaskProblemsInspection
                angular.element('img.lazy').lazyload();
            }, 1);
        };
        DeckController.prototype.updateEvent = function () {
            this.$window.setTimeout(function () {
                // clear all popovers
                angular.element('#deck-popover-content').empty();
                // attach event listener
                angular.element('.deck').each(function () {
                    var _this = this;
                    var deck = this;
                    angular.element(this)
                        .find('span')
                        .popover({
                        animation: false,
                        html: true,
                        placement: function (context, source) {
                            var top = angular.element(deck).find('span').offset().top;
                            if (top - angular.element(_this.$window).scrollTop() < angular.element(_this.$window).height() / 2) {
                                return 'bottom';
                            }
                            return 'top';
                        },
                        container: '#deck-popover-content',
                        trigger: 'hover',
                        content: function () {
                            return angular.element(deck).find('.skill-popover-wrapper').html();
                        }
                    });
                });
            }, 1);
        };
        DeckController.prototype.updateDecks = function () {
            var _this = this;
            this.decks = this.deckIds.map(function (deckId) {
                for (var i = 0; i < _this.servants.length; i++) {
                    var servant = _this.servants[i];
                    if (deckId == servant.id) {
                        return servant;
                    }
                }
                return null;
            });
        };
        DeckController.prototype.updateLink = function () {
            this.link = this.getLinkFromHash(this.encode(this.deckIds));
        };
        DeckController.prototype.getLinkFromHash = function (hash) {
            var a = this.$window.document.createElement('a');
            a.href = this.$window.location.href;
            return a.protocol + '//' + a.hostname + a.pathname + '#/decks/' + hash + '/';
        };
        DeckController.prototype.encode = function (data) {
            return this.$window.btoa(JSON.stringify(data));
        };
        DeckController.prototype.decode = function (encodedString) {
            return JSON.parse(this.$window.atob(encodedString));
        };
        DeckController.$inject = [
            '$scope',
            '$window',
            '$location',
            '$routeParams',
            'ServantService'
        ];
        return DeckController;
    })();
    lova.DeckController = DeckController;
    var AboutController = (function () {
        function AboutController() {
            this.mail = 'd.fiahfy@gmail.com';
        }
        return AboutController;
    })();
    lova.AboutController = AboutController;
})(lova || (lova = {}));
//# sourceMappingURL=controllers.js.map