'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {StatisticsModel} from '../models/statistics';
import {RankingModel} from '../models/ranking';

export class StatisticsService {
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

  public loadWithId(id: number, map: string, queue: string): ng.IPromise<StatisticsModel> {
    let deferred = this.$q.defer();
    this.$http.get(`${StatisticsService.url}${id}/statistics/?map=${map}&queue=${queue}`, {cache: true})
      .then((res: any) => {
        let statistics = new StatisticsModel(res.data);
        deferred.resolve(statistics);
      }, () => {
        deferred.reject();
      });
    return deferred.promise;
  }
}

angular.module(app.appName).service('StatisticsService', StatisticsService);
