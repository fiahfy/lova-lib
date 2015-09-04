/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    var app = angular.module('app', [
        'ngRoute',
        'ui',
        'angulartics', 'angulartics.google.analytics'
    ]);
    var Router = (function () {
        function Router(routerProvider) {
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
        Router.$inject = [
            '$routeProvider'
        ];
        return Router;
    })();
    app.config(Router);
    app.controller('MainController', lova.MainController);
    app.controller('ServantListController', lova.ServantListController);
    app.controller('ServantDetailController', lova.ServantDetailController);
    app.filter('pad', lova.pad);
    app.filter('default', lova.def);
    app.filter('replace', lova.replace);
    app.filter('skillDescription', lova.skillDescription);
    app.service('ServantService', lova.ServantService);
})(lova || (lova = {}));
//# sourceMappingURL=app.js.map