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
    $scope.selectOptionRaces = [
      {race_code: null, race: 'Select Race...'},
      {race_code: 1, race: '人獣'},
      {race_code: 2, race: '神族'},
      {race_code: 3, race: '魔種'},
      {race_code: 4, race: '海種'},
      {race_code: 5, race: '不死'}
    ];
    $scope.race_code = $location.search().race_code;
    $scope.filter = {};
    $scope.predicate = ['race_code', 'race_id'];
    $scope.reverse = false;

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
      $location.url('/servants/' + servant.id + '/');
    };

    $scope.init();

    $scope.$watch('race_code', function () {
      var param = $scope.race_code ? {race_code: $scope.race_code} : {};
      $scope.filter = param;
      $location.search(param).replace();
    }, true);

    angular.element(document).ready(function() {
      //$('select').select2();
    });
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