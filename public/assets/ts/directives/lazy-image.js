'use strict';
//import * as angular from 'angular';
var app = require('../app');
function lazyImage() {
    return {
        restrict: 'A',
        link: function ($scope, element, attributes) {
            window.setTimeout(function () {
                //noinspection TaskProblemsInspection
                element['lazyload']();
                // todo: 一回目の変更時だけ初期表示がされない(/deck)
            });
        }
    };
}
angular.module(app.appName).directive('lovaLazyImage', lazyImage);
