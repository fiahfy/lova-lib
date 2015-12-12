'use strict';
//import * as angular from 'angular';
var app = require('../app');
function escape() {
    return function (input, type) {
        return encodeURIComponent(input);
    };
}
angular.module(app.appName).filter('escape', escape);
angular.module(app.appName).filter('e', escape);
