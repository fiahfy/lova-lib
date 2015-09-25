/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
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
    app.controller('MainController', lova.MainController);
    app.controller('ServantListController', lova.ServantListController);
    app.controller('ServantDetailController', lova.ServantDetailController);
    app.controller('DeckController', lova.DeckController);
    app.controller('PrizeController', lova.PrizeController);
    app.controller('AboutController', lova.AboutController);
    app.directive('fittable', lova.fittable);
    app.directive('skillPopover', lova.skillPopover);
    app.directive('skillPopoverContent', lova.skillPopoverContent);
    app.filter('pad', lova.pad);
    app.filter('default', lova.def);
    app.filter('replace', lova.replace);
    app.filter('skillDescription', lova.skillDescription);
    app.service('ServantService', lova.ServantService);
    app.service('DeckService', lova.DeckService);
    app.service('PrizeService', lova.PrizeService);
    app.service('ScrollService', lova.ScrollService);
})(lova || (lova = {}));
//# sourceMappingURL=app.js.map