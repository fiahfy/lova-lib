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
