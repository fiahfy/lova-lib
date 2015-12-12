'use strict';

export class PrizeModel {
  public id: number;
  public date: Date;
  public name: string;
  public rate: number;

  constructor(obj: any) {
    this.id   = obj.id;
    this.date = new Date(obj.date);
    this.name = obj.name;
    this.rate = obj.rate;
  }
}
