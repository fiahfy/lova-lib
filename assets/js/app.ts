/// <reference path="_all.ts" />

module lova {
    'use strict';

    var app = angular.module('app', [
        'ngRoute',
        'ui',
        'angulartics', 'angulartics.google.analytics',
        'directives',
        'filters'
    ]);

    class Router {
        public static $inject = [
            '$routeProvider'
        ];

        constructor(
            routerProvider: ng.route.IRouteProvider
        ) {
            routerProvider.
                when('/', {
                    templateUrl: 'partials/list.html',
                    controller: 'ServantListController'
                }).
                when('/servants/:id/', {
                    templateUrl: 'partials/detail.html',
                    controller: 'ServantDetailController'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }
    }

    app.config(Router);
    app.controller('MainController', MainController);
    app.controller('ServantListController', ServantListController);
    app.controller('ServantDetailController', ServantDetailController);
    app.service('ServantService', ServantService);
}