'use strict';
require('./servant-list');
//
//namespace lova {
//  'use strict';
//
//  export class MainController {
//    public now: Date;
//
//    public static $inject = [
//    ];
//
//    constructor(
//    ) {
//      this.now = new Date();
//    }
//  }
//
//  interface ServantListParams extends ng.route.IRouteParamsService {
//    view: string;
//    race_id: string;
//  }
//
//  export class ServantListController {
//    public servants: ServantModel[];
//
//    public viewOptions: {key: number; icon: string;}[] = [
//      {key: 0, icon: 'fui-list-columned'},
//      {key: 1, icon: 'fui-list-large-thumbnails'}
//    ];
//
//    public raceIdOptions: {key: number; value: string;}[] = [
//      {key: null, value: 'Select Race...'},
//      {key: 1,    value: '人獣'},
//      {key: 2,    value: '神族'},
//      {key: 3,    value: '魔種'},
//      {key: 4,    value: '海種'},
//      {key: 5,    value: '不死'}
//    ];
//
//    public view: number;
//
//    public raceId: number;
//
//    public q: string;
//
//    public filter: {
//      raceId: number;
//      name: string;
//    } = {
//      raceId: undefined,
//      name: undefined
//    };
//
//    public predicate: string[] = ['raceId', 'raceCode'];
//
//    public reverse: boolean = false;
//
//    public static $inject = [
//      '$scope',
//      '$window',
//      '$location',
//      '$routeParams',
//      'ServantService',
//      'ScrollService'
//    ];
//
//    constructor(
//      private $scope: ng.IScope,
//      private $window: ng.IWindowService,
//      private $location: ng.ILocationService,
//      private $routeParams: ServantListParams,
//      private servantService: ServantService,
//      private scrollService: ScrollService
//    ) {
//      this.view = $routeParams.view ? +$routeParams.view : 0;
//      this.raceId = $routeParams.race_id ? +$routeParams.race_id : 0;
//      this.filter.raceId = this.raceId ? this.raceId : undefined;
//
//      servantService.load()
//        .then(() => {
//          this.servants = servantService.servants;
//          this.scrollService.restore();
//          this.refreshEventListener();
//        });
//
//      $scope.$watch(() => this.raceId, (newValue, oldValue) => {
//        if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
//          return;
//        }
//        this.selectRaceId(this.raceId);
//      }, true);
//    }
//
//    public selectView(view: number): void {
//      this.$location.url(this.$location.search('view', view).url());
//    }
//
//    public selectRaceId(raceId: number): void {
//      this.$location.url(this.$location.search('race_id', raceId).url());
//    }
//
//    public changeQuery(): void {
//      this.filter.name = this.q;
//      this.refreshEventListener();
//    }
//
//    public openServant(servant: ServantModel): void {
//      this.$location.url('/servants/' + servant.id + '/');
//    }
//
//    private refreshEventListener(): void {
//      this.$window.setTimeout(() => {
//        //noinspection TaskProblemsInspection
//        angular.element('img.lazy').lazyload();
//      }, 1);
//    }
//  }
//
//  interface ServantDetailParams extends ng.route.IRouteParamsService {
//    id: string;
//  }
//
//  export class ServantDetailController {
//    public servant: ServantModel;
//
//    public static $inject = [
//      '$routeParams',
//      'ServantService',
//      'ScrollService'
//    ];
//
//    constructor(
//      private $routeParams: ServantDetailParams,
//      private servantService: ServantService,
//      private scrollService: ScrollService
//    ) {
//      servantService.load()
//        .then(() => {
//          this.servant = servantService.getServantWithId(+$routeParams.id);
//          this.scrollService.restore();
//        });
//    }
//  }
//
//  interface DeckParams extends ng.route.IRouteParamsService {
//    hash: string;
//  }
//
//  export class DeckController {
//    public servants: ServantModel[];
//
//    public raceIdOptions: {key: number; value: string;}[] = [
//      {key: null, value: 'Select Race...'},
//      {key: 1,    value: '人獣'},
//      {key: 2,    value: '神族'},
//      {key: 3,    value: '魔種'},
//      {key: 4,    value: '海種'},
//      {key: 5,    value: '不死'}
//    ];
//
//    public raceId: number;
//
//    public raceName: string = 'Select Race...';
//
//    public q: string;
//
//    public filter: {
//      raceId: number;
//      name: string;
//    } = {
//      raceId: undefined,
//      name: undefined
//    };
//
//    public predicate: string[] = ['raceId', 'raceCode'];
//
//    public reverse: boolean = false;
//
//    public url: string;
//
//    public deck: DeckModel;
//
//    public static $inject = [
//      '$window',
//      '$location',
//      '$routeParams',
//      'ServantService',
//      'DeckService'
//    ];
//
//    constructor(
//      private $window: ng.IWindowService,
//      private $location: ng.ILocationService,
//      private $routeParams: DeckParams,
//      private servantService: ServantService,
//      private deckService: DeckService
//    ) {
//      servantService.load()
//        .then(() => {
//          this.servants = servantService.servants;
//          deckService.servants = servantService.servants;
//          deckService.loadWithHash($routeParams.hash);
//          this.deck = deckService.deck;
//          this.url = deckService.url;
//          this.refreshEventListener();
//        });
//
//      angular.element($window.document).ready(() => {
//        let button = angular.element('.copy-clipboard');
//        let clip = new ZeroClipboard(button);
//        clip.on('ready', () => {
//          clip.on('aftercopy', () => {
//            button
//              .attr('data-original-title', 'Copied')
//              .tooltip('show');
//            $window.setTimeout(() => {
//              button
//                .tooltip('hide')
//                .attr('data-original-title', '');
//            }, 1000);
//          });
//        });
//        button
//          .tooltip({
//            trigger: 'manual',
//            container: 'body'
//          });
//      });
//    }
//
//    public setServant(index: number, data: {servantId: number; index: number}): void {
//      let servantId = data.servantId;
//      let oldIndex = data.index;
//      if (oldIndex !== null) {
//        this.deckService.setServant(oldIndex, this.deck.servants[index] ? this.deck.servants[index].id : undefined);
//      }
//      this.deckService.setServant(index, servantId);
//      this.deck = this.deckService.deck;
//      this.url = this.deckService.url;
//      this.refreshEventListener();
//    }
//
//    public clearServant(index: number): void {
//      this.deckService.unsetServant(index);
//      this.deck = this.deckService.deck;
//      this.url = this.deckService.url;
//      this.refreshEventListener();
//    }
//
//    public selectRaceId(raceId: number, raceName: string): void {
//      this.raceId = raceId;
//      this.raceName = raceName;
//      this.filter.raceId = this.raceId ? this.raceId : undefined;
//      this.refreshEventListener();
//    }
//
//    public changeQuery(): void {
//      this.filter.name = this.q;
//      this.refreshEventListener();
//    }
//
//    public openServant(servantId: number): void {
//      this.$window.open('/servants/' + servantId + '/', '_blank');
//    }
//
//    private refreshEventListener(): void {
//      this.$window.setTimeout(() => {
//        //noinspection TaskProblemsInspection
//        angular.element('img.lazy').lazyload();
//      }, 1);
//    }
//  }
//
//  export class PrizeController {
//    public prizes: PrizeModel[];
//
//    public results: PrizeModel[];
//
//    public resultSummary: {prize: PrizeModel; count: number;}[];
//
//    public resultTimes: number;
//
//    public times: number = 10;
//
//    public viewOptions: {key: number; icon: string;}[] = [
//      {key: 0, icon: 'fui-list-numbered'},
//      {key: 1, icon: 'fui-list-thumbnailed'}
//    ];
//
//    public view: number = 0;
//
//    public static $inject = [
//      'PrizeService'
//    ];
//
//    constructor(
//      private prizeService: PrizeService
//    ) {
//      prizeService.load()
//        .then(() => {
//          this.prizes = prizeService.prizes;
//        });
//    }
//
//    public drawPrizes(): void {
//      this.times = !isNaN(this.times) ? this.times : 10;
//      this.times = this.times < 1000 ? this.times : 1000;
//
//      let drawList: {n: number; prize: PrizeModel;}[] = [];
//      let cn = 0;
//      this.prizes.forEach(function(e) {
//        cn += e.rate;
//        drawList.push({n: cn, prize: e});
//      });
//
//      this.results = [];
//      let summary: {[index: number]: {prize: PrizeModel; count: number;}} = {};
//      for (let i = 0; i < this.times; i++) {
//        let r = Math.random() * cn;
//        for (let j = 0; j < drawList.length; j++) {
//          let draw = drawList[j];
//          if (r <= draw.n) {
//            this.results.push(draw.prize);
//            if (summary[draw.prize.id]) {
//              summary[draw.prize.id].count++;
//            } else {
//              summary[draw.prize.id] = {
//                prize: draw.prize, count: 1
//              };
//            }
//            break;
//          }
//        }
//      }
//
//      this.resultTimes = this.times;
//      this.resultSummary = [];
//      let me = this;
//      Object.keys(summary).forEach(function(key) {
//        me.resultSummary.push({
//          prize: this[key].prize, count: this[key].count
//        });
//      }, summary);
//    }
//
//    public selectView(view: number): void {
//      this.view = view;
//    }
//  }
//
//  export class AboutController {
//    public mail: string;
//
//    public static $inject = [
//    ];
//
//    constructor(
//    ) {
//      this.mail = AppConfig.mail;
//    }
//  }
//}