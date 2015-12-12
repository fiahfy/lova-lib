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
