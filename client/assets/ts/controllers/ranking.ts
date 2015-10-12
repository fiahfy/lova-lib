'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {RankingService} from '../services/ranking';
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

  public static $inject = [
    '$routeParams',
    'RankingService'
  ];

  constructor(
    private $routeParams: RankingListParams,
    private rankingService: RankingService
  ) {
    //rankingService.load($routeParams.mode)
    //  .then((rankings) => {
    //    this.rankings = rankings;
    //  });
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
