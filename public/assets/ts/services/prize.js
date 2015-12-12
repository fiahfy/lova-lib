'use strict';
//import * as angular from 'angular';
var app = require('../app');
var prize_1 = require('../models/prize');
var PrizeService = (function () {
    function PrizeService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    PrizeService.prototype.load = function () {
        var deferred = this.$q.defer();
        this.$http.get(PrizeService.url, { cache: true })
            .then(function (res) {
            var prizes = [];
            res.data.forEach(function (prize) {
                prizes.push(new prize_1.PrizeModel(prize));
            });
            deferred.resolve(prizes);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    PrizeService.url = './api/prizes/';
    PrizeService.$inject = [
        '$http',
        '$q'
    ];
    return PrizeService;
})();
exports.PrizeService = PrizeService;
angular.module(app.appName).service('PrizeService', PrizeService);
