/// <reference path="_all.ts" />

module lova {
    'use strict';

    export function fittable(): ng.IDirective {
        return {
            restrict: 'A',
            link: ($scope: ng.IScope, element: JQuery, attributes: any) => {
                //$scope.$watch(attributes.todoFocus, newval => {
                //    if (newval) {
                //        $timeout(() => element[0].focus(), 0, false);
                //    }
                //});
                let elementTop = element.offset().top;
                let dummyWrapper = $('<div>');
                $(window).on('scroll', () => {
                    console.log($(window).scrollTop());
                    console.log(element.offset().top);
                    if ($(window).scrollTop() >= elementTop) {
                        let h = element.height();
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
}
