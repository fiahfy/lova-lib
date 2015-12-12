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
exports.appName = 'app';
exports.modules = [
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
exports.AppConfig = AppConfig;
angular.module(exports.appName).config(Router);
angular.module(exports.appName).config(Locator);
angular.module(exports.appName).value('AppConfig', AppConfig);
require('./controllers');
require('./directives');
require('./services');
require('./filters');
var RootController = (function () {
    function RootController($scope, $location, servantService) {
        var _this = this;
        this.$scope = $scope;
        this.$location = $location;
        this.servantService = servantService;
        this.now = new Date();
        $scope.$on('$routeChangeSuccess', function (event, current, previous) {
            var path = $location.path().match(/^\/(\w+)\//)[1];
            _this.title = (path.charAt(0).toUpperCase() + path.slice(1)) + " : LoVA Tool";
            _this.description = 'Tool Site for Lord of Vermilion Arena';
            switch (path) {
                case 'deck':
                    _this.description = 'Deck Simulator for Lord of Vermilion Arena';
                    return;
                case 'charts':
                    _this.description = 'Charts for Lord of Vermilion Arena';
                    return;
                case 'prize':
                    _this.description = 'Prize Simulator for Lord of Vermilion Arena';
                    return;
                case 'about':
                    return;
                case 'servants':
                    _this.description = 'Servants for Lord of Vermilion Arena';
                    break;
            }
            var matches = $location.path().match(/^\/servants\/(\d+)\//);
            if (!matches) {
                return;
            }
            var id = +matches[1];
            servantService.loadWithId(id)
                .then(function (servant) {
                _this.title = "Servant " + servant.tribeName + "-" + ('000' + servant.tribeCode).slice(-3) + " " + servant.name + " : LoVA Tool";
                _this.description = "" + servant.oralTradition;
            });
        });
    }
    RootController.$inject = [
        '$scope',
        '$location',
        'ServantService'
    ];
    return RootController;
})();
exports.RootController = RootController;
angular.module(exports.appName).controller('RootController', RootController);
