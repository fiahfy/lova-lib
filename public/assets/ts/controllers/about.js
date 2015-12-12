'use strict';
//import * as angular from 'angular';
var app = require('../app');
var AboutController = (function () {
    function AboutController() {
        this.mail = app.AppConfig.mail;
    }
    return AboutController;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: AboutController,
            controllerAs: 'c',
            restrict: 'E',
            templateUrl: '/assets/templates/about.html'
        };
    };
    return Definition;
})();
angular.module('app').directive('lovaAbout', Definition.ddo);
