'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantStatisticModel} from '../models/servant-statistic';

export class ServantStatisticService {
  private static url: string = './api/servants/';

  public static $inject = [
    '$http',
    '$q'
  ];

  constructor(
    private $http: ng.IHttpService,
    private $q: ng.IQService
  ) {
  }

  public loadWithId(id: number, mode: string, map: string, queue: string): ng.IPromise<ServantStatisticModel[]> {
    let deferred = this.$q.defer();
    this.$http.get(`${ServantStatisticService.url}${id}/statistics/?mode=${mode}&map=${map}&queue=${queue}`, {cache: true})
      .then((res: any) => {
        let statistics = res.data.map((e) => {
          return new ServantStatisticModel(e);
        });
        deferred.resolve(statistics);
      }, () => {
        deferred.reject();
      });
    return deferred.promise;
  }
}

angular.module(app.appName).service('ServantStatisticService', ServantStatisticService);
