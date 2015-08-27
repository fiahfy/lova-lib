'use strict';

var app = angular.module('app', [
  'ngRoute',
  'ui',
  'angulartics', 'angulartics.google.analytics',
  'controllers',
  'directives',
  'filters',
  'services'
]);

app.config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider.
      when('/', {
        templateUrl: 'partials/list.html',
        controller: 'ServantListCtrl'
      }).
      when('/servants/:id/', {
        templateUrl: 'partials/detail.html',
        controller: 'ServantDetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]);
