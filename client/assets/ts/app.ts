/// <reference path="../../typings/tsd.d.ts" />
'use strict';

////import * as angular from 'angular';
//import 'angular-route';
//import 'angular-touch';
////import 'angular-ui-bootstrap';
//import 'angular-ui-select2';
//import 'angulartics';
//import 'angulartics-google-analytics';
////import 'bootstrap';
//import 'jquery-lazyload';
//import 'flat-ui';
//
//import 'google-analytics';
//import 'angular-draggable';

export const appName = 'app';
export const modules = [
  'ngRoute',
  'ngTouch',
  'ngDraggable',
  //'ui.bootstrap',
  //'ui.select2',
  'ui',
  'angulartics',
  'angulartics.google.analytics',
  'nvd3'
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
      when('/deck/', {
        template: '<lova-deck></lova-deck>'
      }).
      when('/deck/:hash/', {
        template: '<lova-deck></lova-deck>'
      }).
      when('/servants/', {
        template: '<lova-servant-list></lova-servant-list>'
      }).
      when('/servants/:id/', {
        template: '<lova-servant-detail></lova-servant-detail>'
      }).
      when('/ranking/', {
        template: '<lova-ranking></lova-ranking>'
      }).
      when('/prize/', {
        template: '<lova-prize></lova-prize>'
      }).
      when('/about/', {
        template: '<lova-about></lova-about>'
      }).
      otherwise({
        redirectTo: '/deck/'
      });
  }
}

export class AppConfig {
  public static mail: string = 'd.fiahfy@gmail.com';
}

angular.module(appName).config(Router);
angular.module(appName).config(Locator);
angular.module(appName).value('AppConfig', AppConfig);

import './controllers';
import './directives';
import './services';
import './filters';

export class FooterController {
  public now: Date;

  constructor(
  ) {
    this.now = new Date();
  }
}

angular.module(appName).controller('FooterController', FooterController);
