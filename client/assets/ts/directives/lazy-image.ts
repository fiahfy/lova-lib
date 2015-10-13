'use strict';

//import * as angular from 'angular';
import * as app from '../app';

function lazyImage(): ng.IDirective {
  return {
    restrict: 'A',
    link: ($scope: ng.IScope, element: JQuery, attributes: any) => {
      window.setTimeout(() => {
        //noinspection TaskProblemsInspection
        element['lazyload']();
        // todo: 一回目の変更時だけ初期表示がされない(/deck)
      }, 0);
    }
  };
}

angular.module(app.appName).directive('lovaLazyImage', lazyImage);
