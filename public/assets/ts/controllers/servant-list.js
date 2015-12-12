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
