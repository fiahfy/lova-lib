'use strict';
//import * as angular from 'angular';
var app = require('../app');
var servant_statistic_1 = require('../models/servant-statistic');
var ServantStatisticService = (function () {
    function ServantStatisticService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    ServantStatisticService.prototype.loadWithId = function (id, mode, term, map, queue) {
        var deferred = this.$q.defer();
        this.$http.get("" + ServantStatisticService.url + id + "/statistics/?mode=" + mode + "&term=" + term + "&map=" + map + "&queue=" + queue, { cache: true })
            .then(function (res) {
            var statistics = res.data.map(function (e) {
                return new servant_statistic_1.ServantStatisticModel(e);
            });
            deferred.resolve(statistics);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    ServantStatisticService.prototype.load = function (mode, term, map, queue) {
        var deferred = this.$q.defer();
        this.$http.get(ServantStatisticService.url + "statistics/?mode=" + mode + "&term=" + term + "&map=" + map + "&queue=" + queue, { cache: true })
            .then(function (res) {
            var statistics = res.data.map(function (e) {
                return new servant_statistic_1.ServantStatisticsModel(e);
            });
            deferred.resolve(statistics);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    ServantStatisticService.url = './api/servants/';
    ServantStatisticService.$inject = [
        '$http',
        '$q'
    ];
    return ServantStatisticService;
})();
exports.ServantStatisticService = ServantStatisticService;
angular.module(app.appName).service('ServantStatisticService', ServantStatisticService);
