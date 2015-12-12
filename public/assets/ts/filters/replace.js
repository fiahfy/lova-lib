'use strict';
//import * as angular from 'angular';
var app = require('../app');
function replace() {
    return function (input, regexp, newSubStr) {
        if (!input) {
            return input;
        }
        var reg = new RegExp(regexp);
        return input.replace(reg, newSubStr);
    };
}
angular.module(app.appName).filter('replace', replace);
