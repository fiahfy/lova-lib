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
    routerProvider
      .when('/deck/', {
        template: '<lova-deck></lova-deck>'
      })
      .when('/deck/:hash/', {
        template: '<lova-deck></lova-deck>'
      })
      .when('/servants/', {
        template: '<lova-servant-list></lova-servant-list>'
      })
      .when('/servants/:id/', {
        template: '<lova-servant-detail></lova-servant-detail>'
      })
      .when('/charts/', {
        template: '<lova-chart></lova-chart>'
      })
      .when('/prize/', {
        template: '<lova-prize></lova-prize>'
      })
      .when('/about/', {
        template: '<lova-about></lova-about>'
      })
      .otherwise({
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

import {ServantService} from './services/servant';
import {ServantModel, SkillModel, StatusModel} from './models/servant';

export class RootController {
  public now: Date;

  public title: string;
  public description: string;

  public static $inject = [
    '$scope',
    '$location',
    'ServantService'
  ];

  constructor(
    private $scope: ng.IScope,
    private $location: ng.ILocationService,
    private servantService: ServantService
  ) {
    this.now = new Date();

    $scope.$on('$routeChangeSuccess', (event, current, previous) => {
      let path = $location.path().match(/^\/(\w+)\//)[1];
      this.title = `${path.charAt(0).toUpperCase() + path.slice(1)} : LoVA Tool`;
      this.description = 'Tool Site for Lord of Vermilion Arena';
      switch (path) {
        case 'deck':
          this.description = 'Deck Simulator for Lord of Vermilion Arena';
          return;
        case 'charts':
          this.description = 'Charts for Lord of Vermilion Arena';
          return;
        case 'prize':
          this.description = 'Prize Simulator for Lord of Vermilion Arena';
          return;
        case 'about':
          return;
        case 'servants':
          this.description = 'Servants for Lord of Vermilion Arena';
          break;
      }
      let matches = $location.path().match(/^\/servants\/(\d+)\//);
      if (!matches) {
        return;
      }
      let id = +matches[1];

      servantService.loadWithId(id)
        .then((servant: ServantModel) => {
          this.title = `Servant ${servant.tribeName}-${('000'+servant.tribeCode).slice(-3)} ${servant.name} : LoVA Tool`;
          this.description = `${servant.oralTradition}`;
        });
    });
  }
}

angular.module(appName).controller('RootController', RootController);
