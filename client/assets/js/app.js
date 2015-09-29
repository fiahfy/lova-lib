/// <reference path="_all.ts" />
'use strict';
//var angular = require('angular');
var angular = require('angular');
var MainController = lova.MainController;
var lova;
(function (lova) {
    var app = angular.module('app', [
        'ngRoute',
        'ngTouch',
        'ngDraggable',
        'ui',
        'angulartics', 'angulartics.google.analytics'
    ]);
    var Locator = (function () {
        function Locator(locationProvider) {
            locationProvider.html5Mode(true);
        }
        Locator.$inject = [
            '$locationProvider'
        ];
        return Locator;
    })();
    var Router = (function () {
        function Router(routerProvider) {
            routerProvider.
                when('/servants/', {
                templateUrl: 'templates/pages/servant.html',
                controller: 'ServantListController',
                controllerAs: 'c'
            }).
                when('/servants/:id/', {
                templateUrl: 'templates/pages/servant/detail.html',
                controller: 'ServantDetailController',
                controllerAs: 'c'
            }).
                when('/deck/', {
                templateUrl: 'templates/pages/deck.html',
                controller: 'DeckController',
                controllerAs: 'c'
            }).
                when('/deck/:hash/', {
                templateUrl: 'templates/pages/deck.html',
                controller: 'DeckController',
                controllerAs: 'c'
            }).
                when('/prize/', {
                templateUrl: 'templates/pages/prize.html',
                controller: 'PrizeController',
                controllerAs: 'c'
            }).
                when('/about/', {
                templateUrl: 'templates/pages/about.html',
                controller: 'AboutController',
                controllerAs: 'c'
            }).
                otherwise({
                redirectTo: '/servants/'
            });
        }
        Router.$inject = [
            '$routeProvider'
        ];
        return Router;
    })();
    var AppConfig = (function () {
        function AppConfig() {
        }
        AppConfig.mail = 'd.fiahfy@gmail.com';
        return AppConfig;
    })();
    lova.AppConfig = AppConfig;
    app.config(Router);
    app.config(Locator);
    app.value('AppConfig', AppConfig);
    app.controller('MainController', MainController);
    app.controller('ServantListController', ServantListController);
    app.controller('ServantDetailController', ServantDetailController);
    app.controller('DeckController', DeckController);
    app.controller('PrizeController', PrizeController);
    app.controller('AboutController', AboutController);
    app.directive('fittable', fittable);
    app.directive('skillPopover', skillPopover);
    app.directive('skillPopoverContent', skillPopoverContent);
    app.filter('pad', pad);
    app.filter('default', def);
    app.filter('replace', replace);
    app.filter('skillDescription', skillDescription);
    app.service('ServantService', ServantService);
    app.service('DeckService', DeckService);
    app.service('PrizeService', PrizeService);
    app.service('ScrollService', ScrollService);
})(lova || (lova = {}));
