'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantService} from '../services/servant';
import {StatisticsService} from '../services/statistics';
import {ScrollService} from '../services/scroll';
import {ServantModel, SkillModel, StatusModel} from '../models/servant';
import {StatisticsModel} from '../models/statistics';
import {RankingModel} from '../models/ranking';

interface ServantDetailParams extends ng.route.IRouteParamsService {
  id: string;
}

class ServantDetailController {
  public servant: ServantModel;

  public hash: string;

  public graphData: {win: any[], used: any[]} = {win: [], used: []};

  public graphXAxisTickFormatFunction = () => {
    return (d) => {
      return d3.time.format('%Y-%m-%d')(new Date(d));
    };
  };

  public graphToolTipContentFunction = () => {
    return (item) => {
      return `${item.point[1].toFixed(2)} %`;
    };
  };

  public static $inject = [
    '$routeParams',
    '$location',
    'ServantService',
    'StatisticsService',
    'ScrollService'
  ];

  constructor(
    private $routeParams: ServantDetailParams,
    private $location: ng.ILocationService,
    private servantService: ServantService,
    private statisticsService: StatisticsService,
    private scrollService: ScrollService
  ) {
    this.hash = $location.hash() || 'detail';

    servantService.loadWithId(+$routeParams.id)
      .then((servant: ServantModel) => {
        this.servant = servant;
        this.scrollService.restore();
      });

    statisticsService.loadWithId(+$routeParams.id)
      .then((statistics: StatisticsModel) => {
        this.updateGraphData(statistics);
      });
  }

  private updateGraphData(statistics: StatisticsModel) {
    this.graphData.win = [{
      key: 'Win Rate',
      values: statistics.win.map((ranking: RankingModel) => {
        return [ranking.date, ranking.score];
      })
    }];
    this.graphData.used = [{
      key: 'Used Rate',
      values: statistics.used.map((ranking: RankingModel) => {
        return [ranking.date, ranking.score];
      })
    }];
  }
}

class Definition {
  static ddo() {
    return {
      controller: ServantDetailController,
      controllerAs: 'c',
      restrict: 'E',
      templateUrl: '/assets/templates/servant-detail.html'
    };
  }
}

angular.module('app').directive('lovaServantDetail', Definition.ddo);
