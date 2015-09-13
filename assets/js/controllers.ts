/// <reference path="_all.ts" />

module lova {
    'use strict';

    export class MainController {
        public now: Date;

        public static $inject = [
        ];

        constructor(
        ) {
            this.now = new Date();
        }
    }

    interface ServantListParams extends ng.route.IRouteParamsService {
        view: number;
        race_id: number;
    }

    export class ServantListController {
        public servants: any[] = [];

        public viewOptions: any[] = [
            {key: null, icon: 'fui-list-columned'},
            {key: 1,    icon: 'fui-list-large-thumbnails'}
        ];

        public raceIdOptions: any[] = [
            {key: null, value: 'Select Race...'},
            {key: 1,    value: '人獣'},
            {key: 2,    value: '神族'},
            {key: 3,    value: '魔種'},
            {key: 4,    value: '海種'},
            {key: 5,    value: '不死'}
        ];

        public view: number;

        public raceId: number;

        public q: string;

        public filter: any;

        public predicate: string[] = ['race_id', 'race_code'];

        public reverse: boolean = false;

        public static $inject = [
            '$scope',
            '$window',
            '$location',
            '$routeParams',
            'ServantService',
            'ScrollService'
        ];

        constructor(
            private $scope: ng.IScope,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private $routeParams: ServantListParams,
            private servantService: ServantService,
            private scrollService: ScrollService
        ) {
            this.view = $routeParams.view;
            this.raceId = $routeParams.race_id;
            var filter: any = {};
            if (this.raceId) {
                filter.race_id = this.raceId;
            }
            this.filter = filter;

            servantService.loadServants()
                .then((reason: any) => {
                    this.servants = reason.servants;
                    this.scrollService.restore();
                    this.showServants();
                });

            $scope.$watch(() => this.raceId, (newValue, oldValue) => {
                if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
                    return;
                }
                this.filter.race_id =  this.raceId ? this.raceId : '';
                $location.search('race_id', this.raceId).replace();
            }, true);
        }

        public showServant(servant) {
            this.$location.url('/servants/' + servant.id + '/');
        }

        public selectView(view) {
            this.view = view;
            this.$location.search('view', view).replace();
        }

        public changeQuery() {
            this.filter.name = this.q;
            this.showServants();
        }

        private showServants() {
            this.$window.setTimeout(() => {
                //noinspection TaskProblemsInspection
                angular.element('img.lazy').lazyload({
                    effect: 'fadeIn'
                });
            }, 1);
        }
    }

    interface ServantDetailParams extends ng.route.IRouteParamsService {
        id: number;
    }

    export class ServantDetailController {
        public servant: any[];

        public static $inject = [
            '$routeParams',
            'ServantService',
            'ScrollService'
        ];

        constructor(
            private $routeParams: ServantDetailParams,
            private servantService: ServantService,
            private scrollService: ScrollService
        ) {
            this.servant = null;

            servantService.loadServant($routeParams.id)
                .then((reason: any) => {
                    this.servant = reason.servant;
                    this.scrollService.restore();
                });
        }
    }

    interface DeckParams extends ng.route.IRouteParamsService {
        hash: string;
    }

    export class DeckController {
        public servants: any[] = [];

        public raceIdOptions: any[] = [
            {key: null, value: 'Select Race...'},
            {key: 1,    value: '人獣'},
            {key: 2,    value: '神族'},
            {key: 3,    value: '魔種'},
            {key: 4,    value: '海種'},
            {key: 5,    value: '不死'}
        ];

        public raceId: number;

        public raceName: string = 'Select Race...';

        public q: string;

        public filter: any = {};

        public predicate: string[] = ['race_id', 'race_code'];

        public reverse: boolean = false;

        public link: string;

        public deckIds: number[] = new Array(8);

        public decks: number[];

        public static $inject = [
            '$scope',
            '$window',
            '$location',
            '$routeParams',
            'ServantService'
        ];

        constructor(
            private $scope: ng.IScope,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private $routeParams: DeckParams,
            private servantService: ServantService
        ) {
            try {
                this.deckIds = this.decode($routeParams.hash);
            } catch (e) {}

            servantService.loadServants()
                .then((reason:any) => {
                    this.servants = reason.servants;
                    this.updateServants();
                    this.updateDecks();
                    this.updateLink();
                    this.updateEvent();
                    this.showServants();
                });

            angular.element(document).ready(() => {
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

        public setServant(index: number, data: any, event: any) {
            let servantId = data.servantId;
            let oldIndex = data.index;
            if (oldIndex !== null) {
                this.deckIds[oldIndex] = this.deckIds[index];
            }
            this.deckIds[index] = servantId;
            this.updateServants();
            this.updateDecks();
            this.updateLink();
            this.updateEvent();
        }

        public clearServant(index: number) {
            this.deckIds[index] = 0;
            this.updateServants();
            this.updateDecks();
            this.updateLink();
            this.updateEvent();
        }

        public selectRaceId(raceId: number, raceName: string) {
            this.raceId = raceId;
            this.raceName = raceName;
            this.filter.race_id = this.raceId ? this.raceId : '';
            this.showServants();
        }

        public changeQuery() {
            this.filter.name = this.q;
            this.showServants();
        }

        public showServant(servantId: number) {
            this.$window.open('/lova-tool/#/servants/' + servantId + '/', '_blank');
        }

        private showServants() {
            this.$window.setTimeout(() => {
                //noinspection TaskProblemsInspection
                angular.element('img.lazy').lazyload();
            }, 1);
        }

        private updateEvent() {
            this.$window.setTimeout(() => {
                 angular.element('.deck').each(function() {
                    let deck = this;
                    angular.element(this).find('span').popover({
                        html : true,
                        placement: function(context, source) {
                            var top = angular.element(deck).find('span').offset().top;
                            if (top - angular.element(window).scrollTop() < angular.element(window).height() / 2) {
                                return 'bottom';
                            }
                            return 'top';
                        },
                        container: '#deck-popover-content',
                        trigger: 'hover',
                        content: function() {
                            return angular.element(deck).find('.skill-popover-wrapper').html();
                        }
                    });
                });
            }, 1);
        }

        private updateServants() {
            this.servants.forEach((servant) => {
                servant.setted = this.deckIds.indexOf(servant.id) > -1;
            });
        }

        private updateDecks() {
            this.decks = this.deckIds.map((deckId) => {
                for (let i = 0; i < this.servants.length; i++) {
                    let servant = this.servants[i];
                    if (deckId == servant.id) {
                        return servant;
                    }
                }
                return null;
            });
        }

        private updateLink() {
            this.link = this.getLinkFromHash(this.encode(this.deckIds));
        }

        private getLinkFromHash(hash: string): string {
            let a = this.$window.document.createElement('a');
            a.href = this.$window.location.href;
            return a.protocol + '//' + a.hostname + a.pathname + '#/decks/' + hash + '/';
        }

        private encode(data: number[]): string {
            return this.$window.btoa(JSON.stringify(data));
        }

        private decode(encodedString: string): number[] {
            return JSON.parse(this.$window.atob(encodedString));
        }
    }

    export class AboutController {
        public mail: string = 'd.fiahfy@gmail.com';
    }
}
