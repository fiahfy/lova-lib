'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {SpellStatisticModel, SpellStatisticsModel} from '../models/spell-statistic';

export class SpellStatisticService {
  private static url: string = './api/spells/';

  public static $inject = [
    '$http',
    '$q'
  ];

  constructor(
    private $http: ng.IHttpService,
    private $q: ng.IQService
  ) {
  }

  public load(term: string, map: string, queue: string): ng.IPromise<SpellStatisticsModel[]> {
    let deferred = this.$q.defer();
    this.$http.get(`${SpellStatisticService.url}statistics/?term=${term}&map=${map}&queue=${queue}`, {cache: true})
      .then((res: any) => {
        let statistics = res.data.map((e) => {
          return new SpellStatisticsModel(e);
        });
        deferred.resolve(statistics);
      }, () => {
        deferred.reject();
      });
    return deferred.promise;
  }
}

angular.module(app.appName).service('SpellStatisticService', SpellStatisticService);
