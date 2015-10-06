'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantService} from '../services/servant';
import {DeckService} from '../services/deck';
import {ServantModel, SkillModel, StatusModel} from '../models/servant';
import {DeckModel} from '../models/deck';

interface DeckParams extends ng.route.IRouteParamsService {
  hash: string;
}

class DeckController {
  public servants: ServantModel[];

  public raceIdOptions: {key: number; value: string;}[] = [
    {key: 0, value: 'Select Race...'},
    {key: 1, value: '人獣'},
    {key: 2, value: '神族'},
    {key: 3, value: '魔種'},
    {key: 4, value: '海種'},
    {key: 5, value: '不死'}
  ];

  public raceId: number;

  public raceName: string = 'Select Race...';

  public q: string;

  public filter: {
    raceId: number;
    name: string;
  } = {
    raceId: undefined,
    name: undefined
  };

  public predicate: string[] = ['raceId', 'raceCode'];

  public reverse: boolean = false;

  public url: string;

  public deck: DeckModel;

  public static $inject = [
    '$window',
    '$location',
    '$routeParams',
    'ServantService',
    'DeckService'
  ];

  constructor(
    private $window: ng.IWindowService,
    private $location: ng.ILocationService,
    private $routeParams: DeckParams,
    private servantService: ServantService,
    private deckService: DeckService
  ) {
    servantService.load()
      .then(() => {
        this.servants = servantService.servants;
        deckService.servants = servantService.servants;
        deckService.loadWithHash($routeParams.hash);
        this.deck = deckService.deck;
        this.url = deckService.url;
        this.refreshEventListener();
      });

    angular.element($window.document).ready(() => {
      let button = angular.element('.copy-clipboard');
      let clip = new ZeroClipboard(button);
      clip.on('ready', () => {
        clip.on('aftercopy', () => {
          button
            .attr('data-original-title', 'Copied')
            .tooltip('show');
          $window.setTimeout(() => {
            button
              .tooltip('hide')
              .attr('data-original-title', '');
          }, 1000);
        });
      });
      button
        .tooltip({
          trigger: 'manual',
          container: 'body'
        });
    });
  }

  public setServant(index: number, data: {servantId: number; index: number}): void {
    let servantId = data.servantId;
    let oldIndex = data.index;
    if (oldIndex !== null) {
      this.deckService.setServant(oldIndex, this.deck.servants[index] ? this.deck.servants[index].id : undefined);
    }
    this.deckService.setServant(index, servantId);
    this.deck = this.deckService.deck;
    this.url = this.deckService.url;
    this.refreshEventListener();
  }

  public clearServant(index: number): void {
    this.deckService.unsetServant(index);
    this.deck = this.deckService.deck;
    this.url = this.deckService.url;
    this.refreshEventListener();
  }

  public selectRaceId(raceId: number, raceName: string): void {
    this.raceId = raceId;
    this.raceName = raceName;
    this.filter.raceId = this.raceId ? this.raceId : undefined;
    this.refreshEventListener();
  }

  public changeQuery(): void {
    this.filter.name = this.q;
    this.refreshEventListener();
  }

  public openServant(servantId: number): void {
    this.$window.open('/servants/' + servantId + '/', '_blank');
  }

  private refreshEventListener(): void {
    this.$window.setTimeout(() => {
      //noinspection TaskProblemsInspection
      angular.element('img.lazy').lazyload();
    }, 1);
  }
}

class Definition {
  static ddo() {
    return {
      controller: DeckController,
      controllerAs: 'c',
      restrict: 'E',
      templateUrl: '/assets/templates/deck.html'
    };
  }
}

angular.module('app').directive('lovaDeck', Definition.ddo);
