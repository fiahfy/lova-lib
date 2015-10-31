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

  public graph1Data: any;
  public graph1Options: any;
  public graph2Data: any;
  public graph2Options: any;

  public graphXAxisTickFormatFunction: any = () => {
    return (d) => {
      return d3.time.format('%Y-%m-%d')(new Date(d));
    };
  };

  public graphToolTipContentFunction: any = () => {
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
        this.updateGraph(statistics);
      });
  }

  private updateGraph(statistics: StatisticsModel) {
    this.graph1Data = [];
    this.graph1Data.push({
      key: 'Win Rate',
      area: true,
      color: '#1f77b4',
      values: statistics.win.map((ranking: RankingModel) => {
        return {x: ranking.date, y: ranking.score};
      })
    });
    this.graph2Data = [];
    this.graph2Data.push({
      key: 'Used Rate',
      area: true,
      color: '#9467bd',
      values: statistics.used.map((ranking: RankingModel) => {
        return {x: ranking.date, y: ranking.score};
      })
    });

    this.graph1Options = this.graph2Options = {
      chart: {
        type: 'lineChart',
        height: 350,
        margin : {
          top: 20,
          right: 30,
          bottom: 50,
          left: 50
        },
        transitionDuration: 500,
        interpolate: 'monotone',
        useInteractiveGuideline: true,
        xAxis: {
          tickFormat: (d) => {
            return d3.time.format('%Y-%m-%d')(new Date(d));
          }
        },
        yAxis: {
          axisLabel: 'Rate (%)',
          tickFormat: function(d){
            return d3.format('.02f')(d);
          },
          axisLabelDistance: -10
        }
      }
    };
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
