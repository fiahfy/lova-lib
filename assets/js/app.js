'use strict';

var app = angular.module('app', [
  //'ngAnimate',
  'controllers',
  //'directives',
  //'filters',
  'services'
]);

var controllers = angular.module('controllers', []);

controllers.controller('ListCtrl', ['$scope', '$window', 'ServantService', function($scope, $window, ServantService) {
  $scope.servants = [];
  $scope.isFirstLoading = true;
  $scope.canMoreLoad = false;

  $scope.init = function() {
    $scope.load();
  };

  $scope.load = function() {
    ServantService.load()
      .then(function(res) {
        $scope.servants = res.data;
      });
  };

  $scope.init();
}]);

var services = angular.module('services', []);

services.service('ServantService', ['$http', function($http) {
  this.url = './assets/data/servant.json';

  this.load = function() {
    return $http.get(this.url);
  };
}]);
