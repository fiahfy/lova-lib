/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var angular = require('angular');
require('angular-route');
exports.appName = 'app';
exports.modules = [
    'ngRoute'
];
angular.module(exports.appName, exports.modules);
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
            template: '<lova-servant></lova-servant>'
        }).
            when('/servants/:id/', {}).
            when('/deck/', {}).
            when('/deck/:hash/', {}).
            when('/prize/', {}).
            when('/about/', {}).
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
angular.module(exports.appName).config(Router);
angular.module(exports.appName).config(Locator);
angular.module(exports.appName).value('AppConfig', AppConfig);
require('./controllers');
require('./services');
//app.controller('MainController', MainController);
//app.controller('ServantListController', ServantListController);
//app.controller('ServantDetailController', ServantDetailController);
//app.controller('DeckController', DeckController);
//app.controller('PrizeController', PrizeController);
//app.controller('AboutController', AboutController);
//app.directive('fittable', fittable);
//app.directive('skillPopover', skillPopover);
//app.directive('skillPopoverContent', skillPopoverContent);
//app.filter('pad', pad);
//app.filter('default', def);
//app.filter('replace', replace);
//app.filter('skillDescription', skillDescription);
//app.service('ServantService', ServantService);
//app.service('DeckService', DeckService);
//app.service('PrizeService', PrizeService);
//app.service('ScrollService', ScrollService);
