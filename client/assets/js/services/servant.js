'use strict';
var angular = require('angular');
var app = require('../app');
var models_1 = require('../models');
var ServantService = (function () {
    function ServantService($http, $q) {
        this.$http = $http;
        this.$q = $q;
        this.servants = [];
    }
    ServantService.prototype.load = function () {
        var _this = this;
        var deferred = this.$q.defer();
        if (this.servants.length) {
            deferred.resolve();
            return deferred.promise;
        }
        this.$http.get(ServantService.url)
            .then(function (res) {
            res.data.forEach(function (servant) {
                _this.servants.push(new models_1.ServantModel(servant));
            });
            deferred.resolve();
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };
    ServantService.prototype.getServantWithId = function (id) {
        var result = null;
        this.servants.forEach(function (servant) {
            if (servant.id == id) {
                result = servant;
            }
        });
        return result;
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
