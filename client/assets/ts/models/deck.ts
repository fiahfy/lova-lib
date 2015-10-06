'use strict';

import {ServantModel} from './servant';

export class DeckModel {
  public static deckIndexes: number[] = [0, 1, 2, 3, 4, 5];
  public static sideBoardIndexes: number[] = [6, 7];
  public static size: number = DeckModel.deckIndexes.length + DeckModel.sideBoardIndexes.length;
  public servants: ServantModel[] = [];
  public servantIds: number[] = [];

  public get hash(): string {
    return window.btoa(JSON.stringify(this.servantIds));
  }

  public set hash(value: string) {
    try {
      this.servantIds = JSON.parse(window.atob(value));
    } catch(e) {
      this.servantIds = [];
    }
  }

  public get mana(): number {
    let fill: boolean = true;
    this.servants.forEach(function(e, i) {
      if (!e && DeckModel.deckIndexes.indexOf(i) > -1) {
        fill = false;
      }
    });
    return fill ? 30 : 0;
  }

  public get bonusMana(): number {
    let raceIds: number[] = [];
    let fill: boolean = true;
    this.servants.forEach(function(e, i) {
      if (DeckModel.deckIndexes.indexOf(i) == -1) {
        return;
      }
      if (!e) {
        fill = false;
        return;
      }
      if (raceIds.indexOf(e.raceId) == -1) {
        raceIds.push(e.raceId);
      }
    });
    if (!fill) {
      return 0;
    }
    switch (raceIds.length) {
      case 1:
        return 10;
      case 2:
        return 5;
      default:
        return 0;
    }
  }

  constructor() {
  }

  public updateServants(servants: ServantModel[]) {
    this.servants = [];
    for (let i: number = 0; i < DeckModel.size; i++) {
      let servantId: number = this.servantIds[i];
      let tmp: ServantModel;
      for (let j: number = 0; j < servants.length; j++) {
        let servant: ServantModel = servants[j];
        if (servantId == servant.id) {
          tmp = servant;
          break;
        }
      }
      this.servants.push(tmp);
    }
  }
}
