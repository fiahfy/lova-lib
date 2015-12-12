'use strict';
//import * as angular from 'angular';
var app = require('../app');
function pad() {
    return function (input, length, str) {
        if (input === undefined || input === null) {
            return input;
        }
        return ((new Array(length + 1)).join(str) + input).slice(-length);
    };
}
angular.module(app.appName).filter('pad', pad);
