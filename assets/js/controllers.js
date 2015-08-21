'use strict';

/* Controllers */

var controllers = angular.module('controllers', []);

controllers.controller('MainCtrl', ['$scope',
  function($scope) {
    $scope.now = new Date();
  }
]);

controllers.controller('ServantListCtrl', ['$scope', '$location', 'ServantService',
  function($scope, $location, ServantService) {
    $scope.servants = [];

    $scope.init = function() {
      $scope.load();
    };

    $scope.load = function() {
      ServantService.loadServants()
        .then(function(reason) {
          $scope.servants = reason.servants;
        });
    };

    $scope.showServant = function(servant) {
      $location.path('/servants/' + servant.id + '/');
    };

    $scope.init();
  }
]);

controllers.controller('ServantDetailCtrl', ['$scope', '$routeParams', 'ServantService',
  function($scope, $routeParams, ServantService) {
    $scope.servant = null;

    $scope.init = function() {
      $scope.load();
    };

    $scope.load = function() {
      ServantService.loadServant($routeParams.id)
        .then(function(reason) {
          $scope.servant = reason.servant;
        });
    };

    $scope.init();
  }
]);