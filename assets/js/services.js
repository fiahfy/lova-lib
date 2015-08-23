'use strict';

/* Services */

var services = angular.module('services', []);

services.service('ServantService', ['$http', '$q',
  function($http, $q) {
    this.url = './assets/data/servant.json';
    this.servants = [];

    var getRaceCode = function(servant) {
      return [, '人獣', '神族', '魔種', '海種', '不死'].indexOf(servant.race);
    };

    this.load = function() {
      var deferrd = $q.defer();
      var me = this;
      $http.get(this.url, {cache: true})
        .then(function(res) {
          me.servants = res.data;
          me.servants.forEach(function(servant) {
            servant.race_code = getRaceCode(servant);
          });
          deferrd.resolve();
        }, function() {
          deferrd.reject();
        });
      return deferrd.promise;
    };

    this.loadServants = function() {
      var deferrd = $q.defer();
      var me = this;
      this.load()
        .then(function() {
          deferrd.resolve({servants: me.servants});
        });
      return deferrd.promise;
    };

    this.loadServant = function(id) {
      var deferrd = $q.defer();
      var me = this;
      this.load()
        .then(function() {
          me.servants.forEach(function(servant) {
            if (servant.id == id) {
              deferrd.resolve({servant: servant});
            }
          });
        });
      return deferrd.promise;
    };
  }
]);
