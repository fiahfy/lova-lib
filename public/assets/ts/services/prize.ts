'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {PrizeModel} from '../models/prize';

export class PrizeService {
  private static url: string = './api/prizes/';

  public static $inject = [
    '$http',
    '$q'
  ];

  constructor(
    private $http: ng.IHttpService,
    private $q: ng.IQService
  ) {
  }

  public load(): ng.IPromise<PrizeModel[]> {
    let deferred = this.$q.defer();
    this.$http.get(PrizeService.url, {cache: true})
      .then((res: any) => {
        let prizes: PrizeModel[] = [];
        res.data.forEach((prize: any) => {
          prizes.push(new PrizeModel(prize));
        });
        deferred.resolve(prizes);
      }, () => {
        deferred.reject();
      });
    return deferred.promise;
  }
}

angular.module(app.appName).service('PrizeService', PrizeService);
