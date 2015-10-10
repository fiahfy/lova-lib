'use strict';

//import * as angular from 'angular';
import * as app from '../app';

interface SkillPopoverScope extends ng.IScope {
  skillPopover: any;
}

skillPopover.$inject = [
  '$window'
];

function skillPopover($window: ng.IWindowService): ng.IDirective {
  return {
    restrict: 'A',
    scope: {
      skillPopover: '='
    },
    link: ($scope: SkillPopoverScope, element: JQuery, attributes: any) => {
      let args = $scope.skillPopover;

      // clear all popovers
      angular.element(args.container).empty();

      // attach event listener
      angular.element(element).each(((window: ng.IWindowService) => {
        return function() {
          angular.element(this)
            .popover({
              animation: true,
              html : true,
              placement: () => {
                let top = angular.element(this).offset().top;
                if (top - angular.element(window).scrollTop() < angular.element(window).height() / 2) {
                  return 'bottom';
                }
                return 'top';
              },
              container: args.container,
              trigger: 'hover',
              title: args.title,
              content: () => {
                return angular.element(this).parents(args.card).find(args.content).html();
              }
            });
        }
      })($window));
    }
  };
}

angular.module(app.appName).directive('skillPopover', skillPopover);
