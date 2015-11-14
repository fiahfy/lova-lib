'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantService} from '../services/servant';
import {ServantStatisticService} from '../services/servant-statistic';
import {ScrollService} from '../services/scroll';
import {ServantModel, SkillModel, StatusModel} from '../models/servant';
import {ServantStatisticModel} from '../models/servant-statistic';
import {RankingModel} from '../models/ranking';

interface ServantDetailParams extends ng.route.IRouteParamsService {
  id: string;
}

class ServantDetailController {
  public mapOptions: {key: string; value: string;}[] = [
    {key: 'all',       value: 'All'},
    {key: 'vermilion', value: 'Vermilion'},
    {key: 'braze',     value: 'Braze'}
  ];
  public queueOptions: {key: string; value: string;}[] = [
    {key: 'all',    value: 'All'},
    {key: 'normal', value: 'Normal'},
    {key: 'solo',   value: 'Solo'}
  ];

  public servant: ServantModel;
  public id: number;
  public hash: string;
  public map: string = 'all';
  public queue: string = 'all';
  public statistics1: ServantStatisticModel[];
  public statistics2: ServantStatisticModel[];
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
    '$window',
    '$routeParams',
    '$location',
    'ServantService',
    'ServantStatisticService',
    'ScrollService'
  ];

  constructor(
    private $window: ng.IWindowService,
    private $routeParams: ServantDetailParams,
    private $location: ng.ILocationService,
    private servantService: ServantService,
    private servantStatisticService: ServantStatisticService,
    private scrollService: ScrollService
  ) {
    this.id = +$routeParams.id;
    this.hash = $location.hash() || 'detail';

    servantService.loadWithId(this.id)
      .then((servant: ServantModel) => {
        this.servant = servant;
        this.scrollService.restore();
      });

    this.updateStatistics();

    angular.element($window.document).ready(() => {
      $window.setTimeout(() => {
        angular.element(':radio')['radiocheck']();
      }, 0);
    });
  }

  private updateStatistics() {
    this.servantStatisticService.loadWithId(this.id, 'win', this.map, this.queue)
      .then((statistics: ServantStatisticModel[]) => {
        this.statistics1 = statistics;
        return this.servantStatisticService.loadWithId(this.id, 'used', this.map, this.queue);
      }).then((statistics: ServantStatisticModel[]) => {
        this.statistics2 = statistics;
        this.updateGraph();
      });
  }

  private updateGraph() {
    this.graph1Data = [];
    this.graph1Data.push({
      key: 'Win Rate',
      area: true,
      color: '#1f77b4',
      values: this.statistics1.map((ranking: RankingModel) => {
        return {x: ranking.date, y: ranking.score};
      })
    });
    this.graph1Data.push({
      key: 'Average',
      area: false,
      color: '#ff7f0e',
      values: this.statistics1.map((ranking: RankingModel) => {
        return {x: ranking.date, y: 50};
      })
    });

    this.graph2Data = [];
    this.graph2Data.push({
      key: 'Used Rate',
      area: true,
      color: '#9467bd',
      values: this.statistics2.map((ranking: RankingModel) => {
        return {x: ranking.date, y: ranking.score};
      })
    });
    this.graph2Data.push({
      key: 'Average',
      area: false,
      color: '#ff7f0e',
      values: this.statistics2.map((ranking: RankingModel) => {
        // TODO: servants count取得
        return {x: ranking.date, y: 100 / 221};
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
