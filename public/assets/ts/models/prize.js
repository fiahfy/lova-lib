'use strict';
var PrizeModel = (function () {
    function PrizeModel(obj) {
        this.id = obj.id;
        this.date = new Date(obj.date);
        this.name = obj.name;
        this.rate = obj.rate;
    }
    return PrizeModel;
})();
exports.PrizeModel = PrizeModel;
