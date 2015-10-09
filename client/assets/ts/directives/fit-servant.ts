'use strict';

//import * as angular from 'angular';
import * as app from '../app';

const cardRatio = 150 / 208;

function fitServant(): ng.IDirective {
  return {
    restrict: 'A',
    link: ($scope: ng.IScope, element: JQuery, attributes: any) => {
      let tribeCode = attributes.fitServant;
      let callback = () => {
        // remove css height
        element.css({height: ''});
        // get height, and cast integer
        let height = Math.floor(element.height());
        // set css height
        element.css({height: height});
        // set css background-position-x
        let x = -element.height() * cardRatio * (tribeCode - 1);
        element.css('background-position-x', x);
      };
      // call immediately
      callback();
      // attach event listener
      $(window).on('resize', callback);
      // watch
      $scope.$watch(() => attributes.fitServant, (newValue, oldValue) => {
        tribeCode = newValue;
        callback();
      });
    }
  };
}

angular.module(app.appName).directive('fitServant', fitServant);
