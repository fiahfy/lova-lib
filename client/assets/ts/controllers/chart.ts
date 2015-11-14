'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {SpellStatisticService} from '../services/spell-statistic';
import {ScrollService} from '../services/scroll';
import {SpellStatisticModel, SpellStatisticsModel} from '../models/spell-statistic';

class ChartController {
  public statistics: SpellStatisticsModel[];

  public static $inject = [
    'SpellStatisticService',
    'ScrollService'
  ];

  constructor(
    private spellStatisticService: SpellStatisticService,
    private scrollService: ScrollService
  ) {
    spellStatisticService.load()
      .then((statistics: SpellStatisticsModel[]) => {
        this.statistics = statistics;
        this.updateGraph();
      });
  }

  private updateGraph() {
    console.log(this.statistics);
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
