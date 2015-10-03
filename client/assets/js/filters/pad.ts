'use strict';

import * as angular from 'angular';
import * as app from '../app';

function pad() {
  return (input: string, length: number, str: string) => {
    return ((new Array(length+1)).join(str) + input).slice(-length);
  };
}

angular.module(app.appName).filter('pad', pad);
