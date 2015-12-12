'use strict';
var ServantStatisticModel = (function () {
    function ServantStatisticModel(obj) {
        this.date = new Date(obj.date);
        this.score = obj.score;
    }
    return ServantStatisticModel;
})();
exports.ServantStatisticModel = ServantStatisticModel;
var ServantStatisticsModel = (function () {
    function ServantStatisticsModel(obj) {
        this.servantId = obj.spell_id;
        this.data = obj.data.map(function (e) {
            return new ServantStatisticModel(e);
        });
    }
    return ServantStatisticsModel;
})();
exports.ServantStatisticsModel = ServantStatisticsModel;
