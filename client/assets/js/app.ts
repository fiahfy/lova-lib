/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

import * as angular from 'angular';
import 'angular-route';
//import 'angular-ui-bootstrap';
import 'angular-ui-select2';
//import 'bootstrap';
import 'jquery-lazyload';
import 'flat-ui';

export const appName = 'app';
export const modules = [
  'ngRoute',
  //'ngTouch',
  //'ngDraggable',
  //'ui.bootstrap',
  'ui.select2'
  //'angulartics', 'angulartics.google.analytics'
];

angular.module(appName, modules);

class Locator {
  public static $inject = [
    '$locationProvider'
  ];

  constructor(
    locationProvider: ng.ILocationProvider
  ) {
    locationProvider.html5Mode(true);
  }
}

class Router {
  public static $inject = [
    '$routeProvider'
  ];

  constructor(
    routerProvider: ng.route.IRouteProvider
  ) {
    routerProvider.
      when('/servants/', {
        template: '<lova-servant></lova-servant>'
        //templateUrl: 'templates/pages/servant.html',
        //controller: 'ServantListController',
        //controllerAs: 'c'
      }).
      when('/servants/:id/', {
        //templateUrl: 'templates/pages/servant/detail.html',
        //controller: 'ServantDetailController',
        //controllerAs: 'c'
      }).
      when('/deck/', {
        //templateUrl: 'templates/pages/deck.html',
        //controller: 'DeckController',
        //controllerAs: 'c'
      }).
      when('/deck/:hash/', {
        //templateUrl: 'templates/pages/deck.html',
        //controller: 'DeckController',
        //controllerAs: 'c'
      }).
      when('/prize/', {
        //templateUrl: 'templates/pages/prize.html',
        //controller: 'PrizeController',
        //controllerAs: 'c'
      }).
      when('/about/', {
        //templateUrl: 'templates/pages/about.html',
        //controller: 'AboutController',
        //controllerAs: 'c'
      }).
      otherwise({
        redirectTo: '/servants/'
      });
  }
}

class AppConfig {
  public static mail: string = 'd.fiahfy@gmail.com';
}

angular.module(appName).config(Router);
angular.module(appName).config(Locator);
angular.module(appName).value('AppConfig', AppConfig);

import './controllers';
import './services';

  //app.controller('MainController', MainController);
  //app.controller('ServantListController', ServantListController);
  //app.controller('ServantDetailController', ServantDetailController);
  //app.controller('DeckController', DeckController);
  //app.controller('PrizeController', PrizeController);
  //app.controller('AboutController', AboutController);
  //app.directive('fittable', fittable);
  //app.directive('skillPopover', skillPopover);
  //app.directive('skillPopoverContent', skillPopoverContent);
  //app.filter('pad', pad);
  //app.filter('default', def);
  //app.filter('replace', replace);
  //app.filter('skillDescription', skillDescription);
  //app.service('ServantService', ServantService);
  //app.service('DeckService', DeckService);
  //app.service('PrizeService', PrizeService);
  //app.service('ScrollService', ScrollService);

