/// <reference path="_all.ts" />

module lova {
    'use strict';

    export function fittable(): ng.IDirective {
        return {
            restrict: 'A',
            link: ($scope: ng.IScope, element: JQuery, attributes: any) => {
                let cls = attributes.fittable;
                let elementTop = element.offset().top;
                let dummyWrapper = $('<div>');
                $(window).on('scroll', () => {
                    if ($(window).scrollTop() >= elementTop) {
                        let h = element.height();
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
}
