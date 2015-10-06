'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantModel} from '../models/servant';
import {DeckModel} from '../models/deck';

export class DeckService {
  public servants: ServantModel[] = [];
  public deck: DeckModel;

  public get url(): string {
    let a = this.$window.document.createElement('a');
    a.href = this.$window.location.href;
    return a.protocol + '//'
      + a.hostname + (a.port ? ':' + a.port : a.port)
      + '/deck/' + this.deck.hash + '/';
  }

  public static $inject = [
    '$window'
  ];

  constructor(
    private $window: ng.IWindowService
  ) {
    this.deck = new DeckModel();
  }

  public loadWithHash(hash: string): void {
    this.deck.hash = hash;
    this.deck.updateServants(this.servants);
  }

  public setServant(index: number, servantId: number): void {
    this.deck.servantIds[index] = servantId;
    this.deck.updateServants(this.servants);
  }

  public unsetServant(index: number): void {
    this.setServant(index, undefined);
  }
}

angular.module(app.appName).service('DeckService', DeckService);
