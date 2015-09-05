/// <reference path="_all.ts" />

module lova {
    'use strict';

    var app = angular.module('app', [
        'ngRoute',
        'ngTouch',
        'ngDraggable',
        'ui',
        'angulartics', 'angulartics.google.analytics'
    ]);

    class Router {
        public static $inject = [
            '$routeProvider'
        ];

        constructor(
            routerProvider: ng.route.IRouteProvider
        ) {
            routerProvider.
                when('/servants/', {
                    templateUrl: 'partials/servant.html',
                    controller: 'ServantListController',
                    controllerAs: 'c'
                }).
                when('/servants/:id/', {
                    templateUrl: 'partials/servant/detail.html',
                    controller: 'ServantDetailController',
                    controllerAs: 'c'
                }).
                when('/decks/', {
                    templateUrl: 'partials/deck.html',
                    controller: 'DeckController',
                    controllerAs: 'c'
                }).
                when('/decks/:hash/', {
                    templateUrl: 'partials/deck.html',
                    controller: 'DeckController',
                    controllerAs: 'c'
                }).
                otherwise({
                    redirectTo: '/servants/'
                });
        }
    }

    app.config(Router);
    app.controller('MainController', MainController);
    app.controller('ServantListController', ServantListController);
    app.controller('ServantDetailController', ServantDetailController);
    app.controller('DeckController', DeckController);
    app.directive('fittable', fittable);
    app.filter('pad', pad);
    app.filter('default', def);
    app.filter('replace', replace);
    app.filter('skillDescription', skillDescription);
    app.service('ServantService', ServantService);
    app.service('ScrollService', ScrollService);
}
