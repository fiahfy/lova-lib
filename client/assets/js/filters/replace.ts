'use strict';

import * as angular from 'angular';
import * as app from '../app';

function replace() {
  return (input: string, regexp: string, newSubStr: string) => {
    if (!input) {
      return input;
    }
    let reg = new RegExp(regexp);
    return input.replace(reg, newSubStr);
  };
}

angular.module(app.appName).filter('replace', replace);
