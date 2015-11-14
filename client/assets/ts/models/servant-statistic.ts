'use strict';

export class ServantStatisticModel {
  public id: number;
  public date: Date;
  public servantId: number;
  public seq: number;
  public rank: number;
  public score: number;

  constructor(obj: any) {
    this.id        = obj.id;
    this.date      = new Date(obj.date);
    this.servantId = obj.servant_id;
    this.seq       = obj.seq;
    this.rank      = obj.rank;
    this.score     = obj.score;
  }
}
