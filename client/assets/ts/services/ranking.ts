'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantService} from './servant';
import {ServantModel} from '../models/servant';

export class RankingService {
  private static url: string = './api/ranking/';

  public static $inject = [
    '$http',
    '$q',
    'ServantService'
  ];

  constructor(
    private $http: ng.IHttpService,
    private $q: ng.IQService,
    private servantService: ServantService
  ) {
  }

  //public load(): ng.IPromise<ServantModel[]> {
  //  //let deferred = this.$q.defer();
  //  //this.$http.get(ServantService.url, {cache: true})
  //  //  .then((res: any) => {
  //  //    let servants: ServantModel[] = [];
  //  //    res.data.forEach((servant: any) => {
  //  //      servants.push(new ServantModel(servant));
  //  //    });
  //  //    deferred.resolve(servants);
  //  //  }, () => {
  //  //    deferred.reject();
  //  //  });
  //  //return deferred.promise;
  //}
}

angular.module(app.appName).service('RankingService', RankingService);
