'use strict';

/* Controllers */

var controllers = angular.module('controllers', []);

controllers.controller('MainCtrl', ['$scope', '$location', '$timeout',
  function($scope, $location, $timeout) {
    $scope.now = new Date();

    $scope.scrollPos = {}; // scroll position of each view

    $(window).on('scroll', function() {
      if ($scope.okSaveScroll) { // false between $routeChangeStart and $routeChangeSuccess
        $scope.scrollPos[$location.path()] = $(window).scrollTop();
        //console.log($scope.scrollPos);
      }
    });

    $scope.scrollClear = function(path) {
      $scope.scrollPos[path] = 0;
    };

    $scope.$on('$routeChangeStart', function() {
      $scope.okSaveScroll = false;
    });

    $scope.$on('$routeChangeSuccess', function() {
      $timeout(function() { // wait for DOM, then restore scroll position
        $(window).scrollTop($scope.scrollPos[$location.path()] ? $scope.scrollPos[$location.path()] : 0);
        $scope.okSaveScroll = true;
      }, 0);
    });
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