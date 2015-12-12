'use strict';
var ranking_1 = require('./ranking');
var StatisticsModel = (function () {
    function StatisticsModel(obj) {
        this.win = obj.win.map(function (ranking) {
            return new ranking_1.RankingModel(ranking);
        });
        this.used = obj.used.map(function (ranking) {
            return new ranking_1.RankingModel(ranking);
        });
    }
    return StatisticsModel;
})();
exports.StatisticsModel = StatisticsModel;
