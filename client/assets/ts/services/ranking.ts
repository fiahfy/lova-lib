'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantModel} from '../models/servant';
import {RankingModel} from '../models/ranking';

export class RankingService {
  private static url: string = './api/ranking/servants/';

  public static $inject = [
    '$http',
    '$q'
  ];

  constructor(
    private $http: ng.IHttpService,
    private $q: ng.IQService
  ) {
  }

  public load(mode: string, servants: ServantModel[]): ng.IPromise<RankingModel[]> {
    let deferred = this.$q.defer();
    this.$http.get(`${RankingService.url}${mode}/latest/`, {cache: true})
      .then((res: any) => {
        let rankings: RankingModel[] = [];
        res.data.forEach((ranking: any) => {
          let rankingModel = new RankingModel(ranking);
          for (let servant of servants) {
            if (rankingModel.servantId === servant.id) {
              rankingModel.servant = servant;
              break;
            }
          }
          rankings.push(rankingModel);
        });
        deferred.resolve(rankings);
      }, () => {
        deferred.reject();
      });
    return deferred.promise;
  }
}

angular.module(app.appName).service('RankingService', RankingService);
