'use strict';

import * as angular from 'angular';
import * as app from '../app';
import {PrizeService} from '../services/prize';
import {PrizeModel} from '../models/prize';

class PrizeController {
  public prizes: PrizeModel[];

  public results: PrizeModel[];

  public resultSummary: {prize: PrizeModel; count: number;}[];

  public resultTimes: number;

  public times: number = 10;

  public viewOptions: {key: number; icon: string;}[] = [
    {key: 0, icon: 'fui-list-numbered'},
    {key: 1, icon: 'fui-list-thumbnailed'}
  ];

  public view: number = 0;

  public static $inject = [
    'PrizeService'
  ];

  constructor(
    private prizeService: PrizeService
  ) {
    prizeService.load()
      .then(() => {
        this.prizes = prizeService.prizes;
      });
  }

  public drawPrizes(): void {
    this.times = !isNaN(this.times) ? this.times : 10;
    this.times = this.times < 1000 ? this.times : 1000;

    let drawList: {n: number; prize: PrizeModel;}[] = [];
    let cn = 0;
    this.prizes.forEach(function(e) {
      cn += e.rate;
      drawList.push({n: cn, prize: e});
    });

    this.results = [];
    let summary: {[index: number]: {prize: PrizeModel; count: number;}} = {};
    for (let i = 0; i < this.times; i++) {
      let r = Math.random() * cn;
      for (let j = 0; j < drawList.length; j++) {
        let draw = drawList[j];
        if (r <= draw.n) {
          this.results.push(draw.prize);
          if (summary[draw.prize.id]) {
            summary[draw.prize.id].count++;
          } else {
            summary[draw.prize.id] = {
              prize: draw.prize, count: 1
            };
          }
          break;
        }
      }
    }

    this.resultTimes = this.times;
    this.resultSummary = [];
    let me = this;
    Object.keys(summary).forEach(function(key) {
      me.resultSummary.push({
        prize: this[key].prize, count: this[key].count
      });
    }, summary);
  }

  public selectView(view: number): void {
    this.view = view;
  }
}

class Definition {
  static ddo() {
    return {
      controller: PrizeController,
      controllerAs: 'c',
      restrict: 'E',
      templateUrl: '/assets/templates/prize.html'
    };
  }
}

angular.module('app').directive('lovaPrize', Definition.ddo);
