'use strict';

export class SpellStatisticModel {
  public date: Date;
  public score: number;

  constructor(obj: any) {
    this.date    = new Date(obj.date);
    this.score   = obj.score;
  }
}

export class SpellStatisticsModel {
  public spellId: number;
  public data: SpellStatisticModel[];

  constructor(obj: any) {
    this.spellId = obj.spell_id;
    this.data = obj.data.map((e) => {
      return new SpellStatisticModel(e);
    });
  }
}
