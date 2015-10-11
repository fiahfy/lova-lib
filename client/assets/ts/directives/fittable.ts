'use strict';

//import * as angular from 'angular';
import * as app from '../app';

function fittable(): ng.IDirective {
  return {
    restrict: 'A',
    link: ($scope: ng.IScope, element: JQuery, attributes: any) => {
      let cls = attributes.lovaFittable;
      let elementTop = element.offset().top;
      let dummyWrapper = $('<div>');
      $(window).on('scroll touchmove', () => {
        if ($(window).scrollTop() >= elementTop) {
          let h = element.outerHeight();
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
