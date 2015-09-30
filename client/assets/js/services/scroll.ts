'use strict';

import * as angular from 'angular';
import * as app from '../app';

export class ScrollService {
  private positions: { [index: string]: number; } = {};

  public static $inject = [
    '$location',
    '$window'
  ];

  constructor(
    private $location: ng.ILocationService,
    private $window: ng.IWindowService
  ) {
    angular.element($window).on('scroll', () => {
      this.positions[this.$location.path()] = angular.element($window).scrollTop();
    });
  }

  public restore(): void {
    let top = this.positions[this.$location.path()] || 0;
    angular.element(this.$window).scrollTop(top);
  }
}

angular.module(app.appName).service('ScrollService', ScrollService);
