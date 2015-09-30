'use strict';

import './servant';
import './scroll';

//export var ServantService = ServantService;
//export var ScrollService = ScrollService;

//import * as angular from 'angular';
//import * as app from '../app';
//import {ServantModel, SkillModel, StatusModel, DeckModel, PrizeModel} from '../models';
//
//
//export class DeckService {
//  public servants: ServantModel[] = [];
//  public deck: DeckModel;
//
//  public get url(): string {
//    let a = this.$window.document.createElement('a');
//    a.href = this.$window.location.href;
//    return a.protocol + '//'
//      + a.hostname + (a.port ? ':' + a.port : a.port)
//      + '/deck/' + this.deck.hash + '/';
//  }
//
//  public static $inject = [
//    '$window'
//  ];
//
//  constructor(
//    private $window: ng.IWindowService
//  ) {
//    this.deck = new DeckModel();
//  }
//
//  public loadWithHash(hash: string): void {
//    this.deck.hash = hash;
//    this.deck.updateServants(this.servants);
//  }
//
//  public setServant(index: number, servantId: number): void {
//    this.deck.servantIds[index] = servantId;
//    this.deck.updateServants(this.servants);
//  }
//
//  public unsetServant(index: number): void {
//    this.setServant(index, undefined);
//  }
//}
//
//angular.module(app.appName).service('DeckService', DeckService);
//
//export class PrizeService {
//  private static url: string = './api/prizes/';
//  public prizes: PrizeModel[] = [];
//
//  public static $inject = [
//    '$http',
//    '$q'
//  ];
//
//  constructor(
//    private $http: ng.IHttpService,
//    private $q: ng.IQService
//  ) {
//  }
//
//  public load(): ng.IPromise<any> {
//    let deferred = this.$q.defer();
//    if (this.prizes.length) {
//      deferred.resolve();
//      return deferred.promise;
//    }
//    this.$http.get(PrizeService.url)
//      .then((res: any) => {
//        res.data.forEach((prize: any) => {
//          this.prizes.push(new PrizeModel(prize));
//        });
//        deferred.resolve();
//      }, () => {
//        deferred.reject();
//      });
//    return deferred.promise;
//  }
//}
//
//angular.module(app.appName).service('PrizeService', PrizeService);
//
//export class ScrollService {
//  private positions: { [index: string]: number; } = {};
//
//  public static $inject = [
//    '$location',
//    '$window'
//  ];
//
//  constructor(
//    private $location: ng.ILocationService,
//    private $window: ng.IWindowService
//  ) {
//    angular.element($window).on('scroll', () => {
//      this.positions[this.$location.path()] = angular.element($window).scrollTop();
//    });
//  }
//
//  public restore(): void {
//    let top = this.positions[this.$location.path()] || 0;
//    angular.element(this.$window).scrollTop(top);
//  }
//}
//
//angular.module(app.appName).service('ScrollService', ScrollService);
