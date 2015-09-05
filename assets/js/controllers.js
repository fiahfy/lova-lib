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
        function ServantListController($scope, $location, $routeParams, servantService, scrollService) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.$routeParams = $routeParams;
            this.servantService = servantService;
            this.scrollService = scrollService;
            this.servants = [];
            this.viewOptions = [
                { key: null, icon: 'fui-list-columned' },
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
            this.predicate = ['race_id', 'race_code'];
            this.reverse = false;
            this.view = $routeParams.view;
            this.raceId = $routeParams.race_id;
            var filter = {};
            if (this.raceId) {
                filter.race_id = this.raceId;
            }
            this.filter = filter;
            servantService.loadServants()
                .then(function (reason) {
                _this.servants = reason.servants;
                _this.scrollService.restore();
            });
            $scope.$watch(function () { return _this.raceId; }, function (newValue, oldValue) {
                if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
                    return;
                }
                _this.filter = _this.raceId ? { race_id: _this.raceId } : {};
                $location.search('race_id', _this.raceId).replace();
            }, true);
            angular.element(document).ready(function () {
                //$('select').select2();
            });
        }
        ServantListController.prototype.showServant = function (servant) {
            this.$location.url('/servants/' + servant.id + '/');
        };
        ServantListController.prototype.selectView = function (view) {
            this.view = view;
            this.$location.search('view', view).replace();
        };
        ServantListController.prototype.changeQuery = function () {
            this.filter.name = this.q;
        };
        ServantListController.$inject = [
            '$scope',
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
            this.servant = null;
            servantService.loadServant($routeParams.id)
                .then(function (reason) {
                _this.servant = reason.servant;
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
            this.filter = {};
            this.predicate = ['race_id', 'race_code'];
            this.reverse = false;
            this.decks = '11111111'.split('').map(Number);
            if ($routeParams.hash) {
                this.link = this.getLink($routeParams.hash);
                this.decks = JSON.parse(decodeURIComponent(escape(window.atob($routeParams.hash))));
            }
            servantService.loadServants()
                .then(function (reason) {
                _this.servants = reason.servants;
            });
        }
        DeckController.prototype.drop = function (index, data, event) {
            this.decks[index] = data;
        };
        DeckController.prototype.createLink = function () {
            var a = this.$window.document.createElement('a');
            a.href = this.$window.location.href;
            //console.log(a.scheme);
            this.link = this.getLink(window.btoa(unescape(encodeURIComponent(JSON.stringify(this.decks)))));
        };
        DeckController.prototype.getLink = function (hash) {
            var a = this.$window.document.createElement('a');
            a.href = this.$window.location.href;
            return a.protocol + '//' + a.hostname + a.pathname + '#/decks/' + hash;
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
})(lova || (lova = {}));
//# sourceMappingURL=controllers.js.map