'use strict';

import * as angular from 'angular';
import * as app from '../app';

class AboutController {
  public mail: string;

  constructor(
  ) {
    this.mail = app.AppConfig.mail;
  }
}

class Definition {
  static ddo() {
    return {
      controller: AboutController,
      controllerAs: 'c',
      restrict: 'E',
      templateUrl: '/assets/templates/about.html'
    };
  }
}

angular.module('app').directive('lovaAbout', Definition.ddo);
