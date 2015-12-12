'use strict';

//import * as angular from 'angular';
import * as app from '../app';

function escape() {
  return (input: string, type: string) => {
    return encodeURIComponent(input);
  };
}

angular.module(app.appName).filter('escape', escape);
angular.module(app.appName).filter('e', escape);
