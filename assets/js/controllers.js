/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    var MainController = (function () {
        function MainController($scope, $location, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.$timeout = $timeout;
            this.now = new Date();
            this.scrollPos = {}; // scroll position of each view
            $(window).on('scroll', function () {
                if (_this.okSaveScroll) {
                    _this.scrollPos[$location.path()] = $(window).scrollTop();
                }
            });
            //$scope.scrollClear = function(path) {
            //    $scope.scrollPos[path] = 0;
            //};
            $scope.$on('$routeChangeStart', function () {
                _this.okSaveScroll = false;
            });
            $scope.$on('$routeChangeSuccess', function () {
                $timeout(function () {
                    $(window).scrollTop(_this.scrollPos[$location.path()] ? _this.scrollPos[$location.path()] : 0);
                    _this.okSaveScroll = true;
                }, 0);
            });
        }
        MainController.$inject = [
            '$scope',
            '$location',
            '$timeout'
        ];
        return MainController;
    })();
    lova.MainController = MainController;
    var ServantListController = (function () {
        function ServantListController($scope, $location, $routeParams, servantService) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.$routeParams = $routeParams;
            this.servantService = servantService;
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
            'ServantService'
        ];
        return ServantListController;
    })();
    lova.ServantListController = ServantListController;
    var ServantDetailController = (function () {
        function ServantDetailController($routeParams, servantService) {
            var _this = this;
            this.$routeParams = $routeParams;
            this.servantService = servantService;
            this.servant = null;
            servantService.loadServant($routeParams.id)
                .then(function (reason) {
                _this.servant = reason.servant;
            });
        }
        ServantDetailController.$inject = [
            '$routeParams',
            'ServantService'
        ];
        return ServantDetailController;
    })();
    lova.ServantDetailController = ServantDetailController;
})(lova || (lova = {}));
//# sourceMappingURL=controllers.js.map