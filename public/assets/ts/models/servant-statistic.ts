'use strict';

export class ServantStatisticModel {
  public date: Date;
  public score: number;

  constructor(obj: any) {
    this.date      = new Date(obj.date);
    this.score     = obj.score;
  }
}

export class ServantStatisticsModel {
  public servantId: number;
  public data: ServantStatisticModel[];

  constructor(obj: any) {
    this.servantId = obj.spell_id;
    this.data = obj.data.map((e) => {
      return new ServantStatisticModel(e);
    });
  }
}
