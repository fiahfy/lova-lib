'use strict';

import * as angular from 'angular';
import * as app from '../app';
import {PrizeModel} from '../models/prize';

export class PrizeService {
  private static url: string = './api/prizes/';
  public prizes: PrizeModel[] = [];

  public static $inject = [
    '$http',
    '$q'
  ];

  constructor(
    private $http: ng.IHttpService,
    private $q: ng.IQService
  ) {
  }

  public load(): ng.IPromise<any> {
    let deferred = this.$q.defer();
    if (this.prizes.length) {
      deferred.resolve();
      return deferred.promise;
    }
    this.$http.get(PrizeService.url)
      .then((res: any) => {
        res.data.forEach((prize: any) => {
          this.prizes.push(new PrizeModel(prize));
        });
        deferred.resolve();
      }, () => {
        deferred.reject();
      });
    return deferred.promise;
  }
}

angular.module(app.appName).service('PrizeService', PrizeService);
