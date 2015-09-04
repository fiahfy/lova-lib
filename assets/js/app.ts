/// <reference path="_all.ts" />

module lova {
    'use strict';

    var app = angular.module('app', [
        'ngRoute',
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
                when('/', {
                    templateUrl: 'partials/list.html',
                    controller: 'ServantListController',
                    controllerAs: 'slc'
                }).
                when('/servants/:id/', {
                    templateUrl: 'partials/detail.html',
                    controller: 'ServantDetailController',
                    controllerAs: 'sdc'
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
    app.filter('pad', pad);
    app.filter('default', def);
    app.filter('replace', replace);
    app.filter('skillDescription', skillDescription);
    app.service('ServantService', ServantService);
}
