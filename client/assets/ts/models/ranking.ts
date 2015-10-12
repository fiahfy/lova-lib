'use strict';

export class RankingModel {
  public id: number;
  public date: Date;
  public servantId: number;
  public seq: number;
  public rank: number;
  public rate: number;

  constructor(obj: any) {
    this.id        = obj.id;
    this.date      = obj.date;
    this.servantId = obj.servant_id;
    this.seq       = obj.seq;
    this.rank      = obj.rank;
    this.rate      = obj.rate;
  }
}
