'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantService} from './servant';
import {ServantModel} from '../models/servant';
import {DeckModel} from '../models/deck';

export class DeckService {

  public static $inject = [
    '$window'
  ];

  constructor(
    private $window: ng.IWindowService
  ) {
  }

  public getDeckWithHash(hash: string, servants: ServantModel[]): DeckModel {
    let deck = new DeckModel();
    let servantIds = DeckService.decode(hash);
    for (let i = 0; i < DeckModel.size; i++) {
      let servantId = servantIds[i];
      for (let servant of servants) {
        if (servant.id === servantId) {
          deck.servants[i] = servant;
          break;
        }
      }
    }
    return deck;
  }

  public getUrlWithDeck(deck: DeckModel): string {
    let servantIds: number[] = deck.servants.map((servant) => {
      return servant ? servant.id : undefined;
    });
    console.log(servantIds);
    let a = this.$window.document.createElement('a');
    a.href = this.$window.location.href;
    return a.protocol + '//'
      + a.hostname + (a.port ? ':' + a.port : a.port)
      + '/deck/' + DeckService.encode(servantIds) + '/';
  }

  private static encode(data: number[]): string {
    return window.btoa(JSON.stringify(data));
  }

  private static decode(encodedString: string): number[] {
    try {
      return JSON.parse(window.atob(encodedString));
    } catch(e) {
      return [];
    }
  }
}

angular.module(app.appName).service('DeckService', DeckService);
