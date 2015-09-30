'use strict';
var angular = require('angular');
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
        var top = this.positions[this.$location.path()] || 0;
        angular.element(this.$window).scrollTop(top);
    };
    ScrollService.$inject = [
        '$location',
        '$window'
    ];
    return ScrollService;
})();
exports.ScrollService = ScrollService;
angular.module(app.appName).service('ScrollService', ScrollService);
