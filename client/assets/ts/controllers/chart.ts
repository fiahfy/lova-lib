'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {SpellService} from '../services/spell';
import {SpellStatisticService} from '../services/spell-statistic';
import {SpellStatisticModel, SpellStatisticsModel} from '../models/spell-statistic';

class ChartController {
  public statistics: SpellStatisticsModel[];
  public graphData: any;
  public graphOptions: any;
  public updateDate: Date;

  public static $inject = [
    'SpellStatisticService'
  ];

  constructor(
    private spellStatisticService: SpellStatisticService
  ) {
    this.updateStatistics();
  }

  private updateStatistics() {
    this.spellStatisticService.load()
      .then((statistics: SpellStatisticsModel[]) => {
        this.statistics = statistics;
        this.updateGraph();
      });
  }

  private updateGraph() {
    this.updateDate = null;
    this.graphData = this.statistics.map((e) => {
      return {
        key: SpellService.getSpellNameWithId(e.spellId),
        values: e.data.map((statistics:SpellStatisticModel) => {
          if (!this.updateDate || statistics.date.getTime() > this.updateDate.getTime()) {
            this.updateDate = statistics.date;
          }
          return {x: statistics.date, y: statistics.score};
        })
      }
    });

    this.graphOptions = {
      chart: {
        type: 'lineChart',
        height: 500,
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
          axisLabel: 'Used Rate (%)',
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
      controller: ChartController,
      controllerAs: 'c',
      restrict: 'E',
      templateUrl: '/assets/templates/chart.html'
    };
  }
}

angular.module('app').directive('lovaChart', Definition.ddo);
