'use strict';

import {RankingModel} from './ranking';

export class StatisticsModel {
  public win: RankingModel[];
  public used: RankingModel[];

  constructor(obj: any) {
    this.win = obj.win.map((ranking: any) => {
      return new RankingModel(ranking)
    });
    this.used = obj.used.map((ranking: any) => {
      return new RankingModel(ranking)
    });
  }
}
