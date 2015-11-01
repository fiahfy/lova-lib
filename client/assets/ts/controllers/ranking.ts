'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantService} from '../services/servant';
import {RankingService} from '../services/ranking';
import {ScrollService} from '../services/scroll';
import {ServantModel} from '../models/servant';
import {RankingModel} from '../models/ranking';

interface RankingListParams extends ng.route.IRouteParamsService {
  mode: string;
}

class RankingListController {
  public rankings: RankingModel[];

  public modeOptions: {key: string; value: string;}[] = [
    {key: 'win', value: 'Win Rate'},
    {key: 'used', value: 'Used Rate'}
  ];

  public mode: string;

  public static $inject = [
    '$scope',
    '$location',
    '$routeParams',
    'ServantService',
    'RankingService',
    'ScrollService'
  ];

  public predicate: string[] = ['seq'];

  public reverse: boolean = false;

  constructor(
    private $scope: ng.IScope,
    private $location: ng.ILocationService,
    private $routeParams: RankingListParams,
    private servantService: ServantService,
    private rankingService: RankingService,
    private scrollService: ScrollService
  ) {
    this.mode = $routeParams.mode ? $routeParams.mode : 'win';

    servantService.load()
      .then((servants) => {
        return rankingService.load(this.mode, servants)
      })
      .then((rankings) => {
        this.rankings = rankings;
        this.scrollService.restore();
      });

    $scope.$watch(() => this.mode, (newValue, oldValue) => {
      if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
        return;
      }
      this.selectMode(this.mode);
    }, true);
  }

  public selectMode(mode: string): void {
    this.$location.url(this.$location.search('mode', mode).url());
  }

  public openServant(servant: ServantModel): void {
    this.$location.url('/servants/' + servant.id + '/#statistics');
  }
}

class Definition {
  static ddo() {
    return {
      controller: RankingListController,
      controllerAs: 'c',
      restrict: 'E',
      templateUrl: '/assets/templates/ranking.html'
    };
  }
}

angular.module('app').directive('lovaRanking', Definition.ddo);
