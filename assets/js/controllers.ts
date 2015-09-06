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
            '$location',
            '$routeParams',
            'ServantService',
            'ScrollService'
        ];

        constructor(
            private $scope: ng.IScope,
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
                });

            $scope.$watch(() => this.raceId, (newValue, oldValue) => {
                if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
                    return;
                }
                this.filter = this.raceId ? {race_id: this.raceId} : {};
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

        public filter: any = {};

        public predicate: string[] = ['race_id', 'race_code'];

        public reverse: boolean = false;

        public link: string;

        public decks: number[] = new Array(8);

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
                this.decks = this.decode($routeParams.hash);
            } catch (e) {}

            this.link = this.getLinkFromHash(this.encode(this.decks));

            servantService.loadServants()
                .then((reason:any) => {
                    this.servants = reason.servants;
                    this.updateServants();
                });

            angular.element(document).ready(function() {
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
                this.decks[oldIndex] = this.decks[index];
            }
            this.decks[index] = servantId;
            this.updateServants();
            this.updateLink();
        }

        public clearServant(index: number) {
            this.decks[index] = 0;
            this.updateServants();
            this.updateLink();
        }

        private updateServants() {
            this.servants.forEach((servant) => {
                servant.setted = this.decks.indexOf(servant.id) > -1;
            });
        }

        private updateLink() {
            this.link = this.getLinkFromHash(this.encode(this.decks));
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
}
