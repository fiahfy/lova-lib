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
                when('/decks/', {
                templateUrl: 'templates/pages/deck.html',
                controller: 'DeckController',
                controllerAs: 'c'
            }).
                when('/decks/:hash/', {
                templateUrl: 'templates/pages/deck.html',
                controller: 'DeckController',
                controllerAs: 'c'
            }).
                when('/about/', {
                templateUrl: 'templates/pages/about.html'
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
    app.config(Router);
    app.controller('MainController', lova.MainController);
    app.controller('ServantListController', lova.ServantListController);
    app.controller('ServantDetailController', lova.ServantDetailController);
    app.controller('DeckController', lova.DeckController);
    app.directive('fittable', lova.fittable);
    app.directive('skillPopover', lova.skillPopover);
    app.filter('pad', lova.pad);
    app.filter('default', lova.def);
    app.filter('replace', lova.replace);
    app.filter('skillDescription', lova.skillDescription);
    app.service('ServantService', lova.ServantService);
    app.service('ScrollService', lova.ScrollService);
})(lova || (lova = {}));
//# sourceMappingURL=app.js.map