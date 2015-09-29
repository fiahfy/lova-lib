/// <reference path="_all.ts" />

namespace lova {
  'use strict';

  export function fittable(): ng.IDirective {
    return {
      restrict: 'A',
      link: ($scope: ng.IScope, element: JQuery, attributes: any) => {
        let cls = attributes.fittable;
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

  interface SkillPopoverScope extends ng.IScope {
    skillPopover: any;
  }

  skillPopover.$inject = [
    '$window'
  ];

  export function skillPopover($window): ng.IDirective {
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
        angular.element(element).each(((window) => {
          return function() {
            angular.element(this)
              .popover({
                animation: false,
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
                  return angular.element(this).parents(args.deck).find(args.content).html();
                }
              });
          }
        })($window));
      }
    };
  }

  export function skillPopoverContent(): ng.IDirective {
    return {
      restrict: 'E',
      templateUrl:'templates/elements/skill-popover.html',
      transclude: true,
      replace: true,
      scope: {
        servant: '='
      }
    };
  }
}
