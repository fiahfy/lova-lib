/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    function fittable() {
        return {
            restrict: 'A',
            link: function ($scope, element, attributes) {
                //$scope.$watch(attributes.todoFocus, newval => {
                //    if (newval) {
                //        $timeout(() => element[0].focus(), 0, false);
                //    }
                //});
                var elementTop = element.offset().top;
                var dummyWrapper = $('<div>');
                $(window).on('scroll', function () {
                    if ($(window).scrollTop() >= elementTop) {
                        var h = element.height();
                        element.css({
                            position: 'fixed',
                            top: 0
                        });
                        element.after(dummyWrapper.height(h));
                        return;
                    }
                    element.css({
                        position: '',
                        top: ''
                    });
                    dummyWrapper.remove();
                });
            }
        };
    }
    lova.fittable = fittable;
})(lova || (lova = {}));
//# sourceMappingURL=directives.js.map