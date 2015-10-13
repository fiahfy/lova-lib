'use strict';

import {ServantModel} from './servant';

export class RankingModel {
  public id: number;
  public mode: string;
  public date: Date;
  public servantId: number;
  public seq: number;
  public rank: number;
  public score: number;
  public servant: ServantModel;

  constructor(obj: any) {
    this.id        = obj.id;
    this.mode      = obj.mode;
    this.date      = obj.date;
    this.servantId = obj.servant_id;
    this.seq       = obj.seq;
    this.rank      = obj.rank;
    this.score     = obj.score;
  }
}
