'use strict';

export class SpellStatisticModel {
  public id: number;
  public date: Date;
  public spellId: number;
  public seq: number;
  public rank: number;
  public score: number;

  constructor(obj: any) {
    this.id      = obj.id;
    this.date    = new Date(obj.date);
    this.spellId = obj.spell_id;
    this.seq     = obj.seq;
    this.rank    = obj.rank;
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
