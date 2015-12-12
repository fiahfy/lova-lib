'use strict';
//import * as angular from 'angular';
var app = require('../app');
var spell_statistic_1 = require('../models/spell-statistic');
var SpellStatisticService = (function () {
    function SpellStatisticService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    SpellStatisticService.prototype.load = function (term, map, queue) {
        var deferred = this.$q.defer();
        this.$http.get(SpellStatisticService.url + "statistics/?term=" + term + "&map=" + map + "&queue=" + queue, { cache: true })
            .then(function (res) {
            var statistics = res.data.map(function (e) {
                return new spell_statistic_1.SpellStatisticsModel(e);
            });
            deferred.resolve(statistics);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    SpellStatisticService.url = './api/spells/';
    SpellStatisticService.$inject = [
        '$http',
        '$q'
    ];
    return SpellStatisticService;
})();
exports.SpellStatisticService = SpellStatisticService;
angular.module(app.appName).service('SpellStatisticService', SpellStatisticService);
