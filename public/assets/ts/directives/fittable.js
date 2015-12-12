'use strict';
//import * as angular from 'angular';
var app = require('../app');
function fittable() {
    return {
        restrict: 'A',
        link: function ($scope, element, attributes) {
            var cls = attributes.lovaFittable;
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
angular.module(app.appName).directive('lovaFittable', fittable);
