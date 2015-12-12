'use strict';
//import * as angular from 'angular';
var app = require('../app');
var ScrollService = (function () {
    function ScrollService($location, $window) {
        var _this = this;
        this.$location = $location;
        this.$window = $window;
        this.positions = {};
        angular.element($window).on('scroll', function () {
            _this.positions[_this.$location.path()] = angular.element($window).scrollTop();
        });
    }
    ScrollService.prototype.restore = function () {
        var _this = this;
        var top = this.positions[this.$location.path()] || 0;
        // TODO: wait 100ms (not working with 0ms, 1ms)
        this.$window.setTimeout(function () {
            angular.element(_this.$window).scrollTop(top);
        }, 100);
    };
    ScrollService.$inject = [
        '$location',
        '$window'
    ];
    return ScrollService;
})();
exports.ScrollService = ScrollService;
angular.module(app.appName).service('ScrollService', ScrollService);
