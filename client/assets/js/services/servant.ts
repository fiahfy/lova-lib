'use strict';

import * as angular from 'angular';
import * as app from '../app';
import {ServantModel} from '../models/servant';

export class ServantService {
  private static url: string = './api/servants/';
  public servants: ServantModel[] = [];

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
    if (this.servants.length) {
      deferred.resolve();
      return deferred.promise;
    }
    this.$http.get(ServantService.url)
      .then((res: any) => {
        res.data.forEach((servant: any) => {
          this.servants.push(new ServantModel(servant));
        });
        deferred.resolve();
      }, () => {
        deferred.reject();
      });
    return deferred.promise;
  }

  public getServantWithId(id: number): ServantModel {
    let result: ServantModel = null;
    this.servants.forEach((servant) => {
      if (servant.id == id) {
        result = servant;
      }
    });
    return result;
  }
}

angular.module(app.appName).service('ServantService', ServantService);
