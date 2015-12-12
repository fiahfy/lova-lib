'use strict';
var SpellStatisticModel = (function () {
    function SpellStatisticModel(obj) {
        this.date = new Date(obj.date);
        this.score = obj.score;
    }
    return SpellStatisticModel;
})();
exports.SpellStatisticModel = SpellStatisticModel;
var SpellStatisticsModel = (function () {
    function SpellStatisticsModel(obj) {
        this.spellId = obj.spell_id;
        this.data = obj.data.map(function (e) {
            return new SpellStatisticModel(e);
        });
    }
    return SpellStatisticsModel;
})();
exports.SpellStatisticsModel = SpellStatisticsModel;
