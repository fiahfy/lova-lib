'use strict';
var angular = require('angular');
require('jquery-lazyload');
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
angular.module('app').directive('lovaServant', Definition.ddo);
