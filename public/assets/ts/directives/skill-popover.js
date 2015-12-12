'use strict';
//import * as angular from 'angular';
var app = require('../app');
skillPopover.$inject = [
    '$window'
];
function skillPopover($window) {
    return {
        restrict: 'A',
        scope: {
            lovaSkillPopover: '='
        },
        link: function ($scope, element, attributes) {
            var args = $scope.lovaSkillPopover;
            // clear all popovers
            angular.element(args.container).empty();
            // attach event listener
            angular.element(element).each((function (window) {
                return function () {
                    var _this = this;
                    angular.element(this)
                        .popover({
                        animation: true,
                        html: true,
                        placement: function () {
                            var top = angular.element(_this).offset().top;
                            if (top - angular.element(window).scrollTop() < angular.element(window).height() / 2) {
                                return 'bottom';
                            }
                            return 'top';
                        },
                        container: args.container,
                        trigger: 'hover',
                        title: args.title,
                        content: function () {
                            return angular.element(_this).parents(args.card).find(args.content).html();
                        }
                    });
                };
            })($window));
        }
    };
}
angular.module(app.appName).directive('lovaSkillPopover', skillPopover);
