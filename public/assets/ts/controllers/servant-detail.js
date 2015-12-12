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
