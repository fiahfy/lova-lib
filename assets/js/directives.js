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
    function skillPopover() {
        return {
            restrict: 'E',
            templateUrl: 'partials/elements/skill-popover.html',
            transclude: true,
            replace: true,
            scope: {
                servant: '='
            }
        };
    }
    lova.skillPopover = skillPopover;
})(lova || (lova = {}));
//# sourceMappingURL=directives.js.map