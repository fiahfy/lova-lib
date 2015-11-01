'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantModel} from '../models/servant';

export class ServantService {
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

  public load(): ng.IPromise<ServantModel[]> {
    let deferred = this.$q.defer();
    this.$http.get(`${ServantService.url}?fields=-oral_tradition`, {cache: true})
      .then((res: any) => {
        let servants: ServantModel[] = [];
        res.data.forEach((servant: any) => {
          servants.push(new ServantModel(servant));
        });
        deferred.resolve(servants);
      }, () => {
        deferred.reject();
      });
    return deferred.promise;
  }

  public loadWithId(id: number): ng.IPromise<ServantModel> {
    let deferred = this.$q.defer();
    this.$http.get(`${ServantService.url}${id}/`, {cache: true})
      .then((res: any) => {
        let servant = new ServantModel(res.data);
        deferred.resolve(servant);
      }, () => {
        deferred.reject();
      });
    return deferred.promise;
  }
}

angular.module(app.appName).service('ServantService', ServantService);
