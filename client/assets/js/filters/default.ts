'use strict';

import * as angular from 'angular';
import * as app from '../app';

function def() {
  return (input: string, value: any) => {
    return (typeof input === 'undefined' || input == null) ? value : input;
  };
}

angular.module(app.appName).filter('default', def);
