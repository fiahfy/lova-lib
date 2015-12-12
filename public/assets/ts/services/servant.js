'use strict';
//import * as angular from 'angular';
var app = require('../app');
var servant_1 = require('../models/servant');
var ServantService = (function () {
    function ServantService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    ServantService.prototype.load = function () {
        var deferred = this.$q.defer();
        this.$http.get(ServantService.url + "?with_statistic&fields=-oral_tradition", { cache: true })
            .then(function (res) {
            var servants = res.data.map(function (e) {
                return new servant_1.ServantModel(e);
            });
            deferred.resolve(servants);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    ServantService.prototype.loadWithId = function (id) {
        var deferred = this.$q.defer();
        this.$http.get("" + ServantService.url + id + "/", { cache: true })
            .then(function (res) {
            var servant = new servant_1.ServantModel(res.data);
            deferred.resolve(servant);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    ServantService.url = './api/servants/';
    ServantService.$inject = [
        '$http',
        '$q'
    ];
    return ServantService;
})();
exports.ServantService = ServantService;
angular.module(app.appName).service('ServantService', ServantService);
