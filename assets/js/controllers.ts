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
        view: string;
        race_id: string;
    }

    export class ServantListController {
        public servants: ServantModel[] = [];

        public viewOptions: any[] = [
            {key: 0, icon: 'fui-list-columned'},
            {key: 1, icon: 'fui-list-large-thumbnails'}
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

        public filter: {
            raceId: number;
            name: string;
        } = {
            raceId: undefined,
            name: undefined
        };

        public predicate: string[] = ['raceId', 'raceCode'];

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
            this.view = $routeParams.view ? +$routeParams.view : 0;
            this.raceId = $routeParams.race_id ? +$routeParams.race_id : 0;
            this.filter.raceId = this.raceId ? this.raceId : undefined;

            servantService.load()
                .then(() => {
                    this.servants = servantService.servants;
                    this.scrollService.restore();
                    this.showServants();
                });

            $scope.$watch(() => this.raceId, (newValue, oldValue) => {
                if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
                    return;
                }
                this.selectRaceId(this.raceId);
            }, true);
        }

        public selectView(view: number) {
            this.$location.url(this.$location.search('view', view).url());
        }

        public selectRaceId(raceId: number) {
            this.$location.url(this.$location.search('race_id', this.raceId).url());
        }

        public changeQuery() {
            this.filter.name = this.q;
            this.showServants();
        }

        public openServant(servant: ServantModel) {
            this.$location.url('/servants/' + servant.id + '/');
        }

        private showServants() {
            this.$window.setTimeout(() => {
                //noinspection TaskProblemsInspection
                angular.element('img.lazy').lazyload();
            }, 1);
        }
    }

    interface ServantDetailParams extends ng.route.IRouteParamsService {
        id: string;
    }

    export class ServantDetailController {
        public servant: ServantModel;

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
            servantService.load()
                .then(() => {
                    this.servant = servantService.getServantWithId(+$routeParams.id);
                    this.scrollService.restore();
                });
        }
    }

    interface DeckParams extends ng.route.IRouteParamsService {
        hash: string;
    }

    export class DeckController {
        public servants: ServantModel[] = [];

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

        public filter: {
            raceId: number;
            name: string;
        } = {
            raceId: undefined,
            name: undefined
        };

        public predicate: string[] = ['raceId', 'raceCode'];

        public reverse: boolean = false;

        public link: string;

        public deckIds: number[] = new Array(8);

        public decks: ServantModel[];

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

            servantService.load()
                .then(() => {
                    this.servants = servantService.servants;
                    this.updateDecks();
                    this.updateLink();
                    this.updateEvent();
                    this.showServants();
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

        public setServant(index: number, data: any, event: any) {
            let servantId = data.servantId;
            let oldIndex = data.index;
            if (oldIndex !== null) {
                this.deckIds[oldIndex] = this.deckIds[index];
            }
            this.deckIds[index] = servantId;
            this.updateDecks();
            this.updateLink();
            this.updateEvent();
        }

        public clearServant(index: number) {
            this.deckIds[index] = 0;
            this.updateDecks();
            this.updateLink();
            this.updateEvent();
        }

        public selectRaceId(raceId: number, raceName: string) {
            this.raceId = raceId;
            this.raceName = raceName;
            this.filter.raceId = this.raceId ? this.raceId : undefined;
            this.updateEvent();
            this.showServants();
        }

        public changeQuery() {
            this.filter.name = this.q;
            this.updateEvent();
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
                // clear all popovers
                angular.element('#deck-popover-content').empty();
                // attach event listener
                angular.element('.deck').each(function() {
                    let deck = this;
                    angular.element(this)
                        .find('span')
                        .popover({
                            animation: false,
                            html : true,
                            placement: (context, source) => {
                                let top = angular.element(deck).find('span').offset().top;
                                if (top - angular.element(this.$window).scrollTop() < angular.element(this.$window).height() / 2) {
                                    return 'bottom';
                                }
                                return 'top';
                            },
                            container: '#deck-popover-content',
                            trigger: 'hover',
                            content: () => {
                                return angular.element(deck).find('.skill-popover-wrapper').html();
                            }
                        });
                });
            }, 1);
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
