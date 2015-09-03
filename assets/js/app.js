/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    var app = angular.module('app', [
        'ngRoute',
        'ui',
        'angulartics', 'angulartics.google.analytics',
        'directives',
        'filters'
    ]);
    var Router = (function () {
        function Router(routerProvider) {
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
        Router.$inject = [
            '$routeProvider'
        ];
        return Router;
    })();
    app.config(Router);
    app.controller('MainController', lova.MainController);
    app.controller('ServantListController', lova.ServantListController);
    app.controller('ServantDetailController', lova.ServantDetailController);
    app.service('ServantService', lova.ServantService);
})(lova || (lova = {}));
//# sourceMappingURL=app.js.map