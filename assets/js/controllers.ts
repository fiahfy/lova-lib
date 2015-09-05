/// <reference path="_all.ts" />

module lova {
    'use strict';

    export class MainController {
        public static $inject = [
        ];

        public now: Date;

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
        public static $inject = [
            '$scope',
            '$location',
            '$routeParams',
            'ServantService',
            'ScrollService'
        ];

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
        public static $inject = [
            '$routeParams',
            'ServantService',
            'ScrollService'
        ];

        public servant: any[];

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
}
