'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantService} from '../services/servant';
import {ScrollService} from '../services/scroll';
import {ServantModel, SkillModel, StatusModel} from '../models/servant';

interface ServantListParams extends ng.route.IRouteParamsService {
  view: string;
  race_id: string;
}

class ServantListController {
  public servants: ServantModel[];

  public viewOptions: {key: number; icon: string;}[] = [
    {key: 0, icon: 'fui-list-columned'},
    {key: 1, icon: 'fui-list-large-thumbnails'}
  ];

  public raceIdOptions: {key: number; value: string;}[] = [
    {key: 0, value: 'Select Race...'},
    {key: 1, value: '人獣'},
    {key: 2, value: '神族'},
    {key: 3, value: '魔種'},
    {key: 4, value: '海種'},
    {key: 5, value: '不死'}
  ];

  public view: number;

  public raceId: number;

  public q: string;

  public filter: {
    raceId: number;
    name: string;
  } = {
    raceId: undefined,
    name: undefined
  };

  public predicate: string[] = ['raceId', 'raceCode'];

  public reverse: boolean = false;

  public static $inject = [
    '$scope',
    '$window',
    '$location',
    '$routeParams',
    'ServantService',
    'ScrollService'
  ];

  constructor(
    private $scope: ng.IScope,
    private $window: ng.IWindowService,
    private $location: ng.ILocationService,
    private $routeParams: ServantListParams,
    private servantService: ServantService,
    private scrollService: ScrollService
  ) {
    this.view = $routeParams.view ? +$routeParams.view : 0;
    this.raceId = $routeParams.race_id ? +$routeParams.race_id : 0;
    this.filter.raceId = this.raceId ? this.raceId : undefined;

    servantService.load()
      .then(() => {
        this.servants = servantService.servants;
        this.scrollService.restore();
        this.refreshEventListener();
      });

    $scope.$watch(() => this.raceId, (newValue, oldValue) => {
      if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
        return;
      }
      this.selectRaceId(this.raceId);
    }, true);
  }

  public selectView(view: number): void {
    this.$location.url(this.$location.search('view', view).url());
  }

  public selectRaceId(raceId: number): void {
    this.$location.url(this.$location.search('race_id', raceId).url());
  }

  public changeQuery(): void {
    this.filter.name = this.q;
    this.refreshEventListener();
  }

  public openServant(servant: ServantModel): void {
    this.$location.url('/servants/' + servant.id + '/');
  }

  private refreshEventListener(): void {
    this.$window.setTimeout(() => {
      //noinspection TaskProblemsInspection
      angular.element('img.lazy').lazyload();
    }, 1);
  }
}

class Definition {
  static ddo() {
    return {
      controller: ServantListController,
      controllerAs: 'c',
      restrict: 'E',
      templateUrl: '/assets/templates/servant-list.html'
    };
  }
}

angular.module('app').directive('lovaServantList', Definition.ddo);
