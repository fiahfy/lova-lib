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
                $(window).on('scroll', function () {
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
})(lova || (lova = {}));
//# sourceMappingURL=directives.js.map