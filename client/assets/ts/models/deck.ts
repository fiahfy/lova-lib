'use strict';

import {ServantModel} from './servant';

export class DeckModel {
  public static deckIndexes: number[] = [0, 1, 2, 3, 4, 5];
  public static sideBoardIndexes: number[] = [6, 7];
  public static size: number = DeckModel.deckIndexes.length + DeckModel.sideBoardIndexes.length;
  public servants: ServantModel[] = new Array(DeckModel.size);

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
    let tribeIds: number[] = [];
    let fill: boolean = true;
    this.servants.forEach(function(e, i) {
      if (DeckModel.deckIndexes.indexOf(i) == -1) {
        return;
      }
      if (!e) {
        fill = false;
        return;
      }
      if (tribeIds.indexOf(e.tribeId) == -1) {
        tribeIds.push(e.tribeId);
      }
    });
    if (!fill) {
      return 0;
    }
    switch (tribeIds.length) {
      case 1:
        return 10;
      case 2:
        return 5;
      default:
        return 0;
    }
  }

  public get totalMana(): number {
    return this.servants.reduce(function(p, e, i) {
      if (e && DeckModel.deckIndexes.indexOf(i) > -1) {
        return e.cost + p;
      }
      return p;
    }, 0);
  }

  constructor() {
  }
}
