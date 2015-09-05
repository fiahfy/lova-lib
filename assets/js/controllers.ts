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

            angular.element(document).ready(function() {
                //$('select').select2();
            });
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

        public decks: number[] = '11111111'.split('').map(Number);

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
            if ($routeParams.hash) {
                this.link = this.getLink($routeParams.hash);
                this.decks = JSON.parse(decodeURIComponent( escape(window.atob($routeParams.hash))));
            }

            servantService.loadServants()
                .then((reason:any) => {
                    this.servants = reason.servants;
                });
        }

        public drop(index: number, data: any, event: any) {
            this.decks[index] = data;
        }

        public createLink() {
            let a = this.$window.document.createElement('a');
            a.href = this.$window.location.href;
            //console.log(a.scheme);
            this.link = this.getLink(window.btoa(unescape(encodeURIComponent(JSON.stringify(this.decks)))));
        }

        private getLink(hash: string): string {
            let a = this.$window.document.createElement('a');
            a.href = this.$window.location.href;
            return a.protocol + '//' + a.hostname + a.pathname + '#/decks/' + hash;
        }
    }
}
