/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    function fittable() {
        return {
            restrict: 'A',
            link: function ($scope, element, attributes) {
                var cls = attributes.fittable;
                var elementTop = element.offset().top;
                var dummyWrapper = $('<div>');
                $(window).on('scroll touchmove', function () {
                    if ($(window).scrollTop() >= elementTop) {
                        var h = element.outerHeight();
                        element.addClass(cls);
                        element.after(dummyWrapper.height(h));
                        return;
                    }
                    element.removeClass(cls);
                    dummyWrapper.remove();
                });
            }
        };
    }
    lova.fittable = fittable;
    skillPopover.$inject = [
        '$window'
    ];
    function skillPopover($window) {
        return {
            restrict: 'A',
            scope: {
                skillPopover: '='
            },
            link: function ($scope, element, attributes) {
                var args = $scope.skillPopover;
                // clear all popovers
                angular.element(args.container).empty();
                // attach event listener
                angular.element(element).each((function (window) {
                    return function () {
                        var _this = this;
                        angular.element(this)
                            .popover({
                            animation: false,
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
                                return angular.element(_this).parents(args.deck).find(args.content).html();
                            }
                        });
                    };
                })($window));
            }
        };
    }
    lova.skillPopover = skillPopover;
    function skillPopoverContent() {
        return {
            restrict: 'E',
            templateUrl: 'templates/elements/skill-popover.html',
            transclude: true,
            replace: true,
            scope: {
                servant: '='
            }
        };
    }
    lova.skillPopoverContent = skillPopoverContent;
})(lova || (lova = {}));
