'use strict';
//import * as angular from 'angular';
var app = require('../app');
function def() {
    return function (input, value) {
        return (typeof input === 'undefined' || input == null) ? value : input;
    };
}
angular.module(app.appName).filter('default', def);
