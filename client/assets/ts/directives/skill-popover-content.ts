'use strict';

//import * as angular from 'angular';
import * as app from '../app';

function skillPopoverContent(): ng.IDirective {
  return {
    restrict: 'E',
    templateUrl:'/assets/templates/elements/skill-popover.html',
    transclude: true,
    replace: true,
    scope: {
      servant: '='
    }
  };
}

angular.module(app.appName).directive('skillPopoverContent', skillPopoverContent);
