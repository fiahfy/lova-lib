'use strict';
//import * as angular from 'angular';
var app = require('../app');
function skillPopoverContent() {
    return {
        restrict: 'E',
        templateUrl: '/assets/templates/elements/skill-popover.html',
        transclude: true,
        replace: true,
        scope: {
            servant: '='
        }
    };
}
angular.module(app.appName).directive('lovaSkillPopoverContent', skillPopoverContent);
