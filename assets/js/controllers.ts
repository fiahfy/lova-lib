/// <reference path="_all.ts" />

module lova {
    'use strict';

    export class MainController {
        public static $inject = [
            '$scope',
            '$location',
            '$timeout'
        ];

        public now: Date;

        private scrollPos: any;

        private okSaveScroll: boolean;

        constructor(
            private $scope: ng.IScope,
            private $location: ng.ILocationService,
            private $timeout: ng.ITimeoutService
        ) {
            this.now = new Date();

            this.scrollPos = {}; // scroll position of each view

            $(window).on('scroll', () => {
                if (this.okSaveScroll) { // false between $routeChangeStart and $routeChangeSuccess
                    this.scrollPos[$location.path()] = $(window).scrollTop();
                }
            });

            //$scope.scrollClear = function(path) {
            //    $scope.scrollPos[path] = 0;
            //};

            $scope.$on('$routeChangeStart', () => {
                this.okSaveScroll = false;
            });

            $scope.$on('$routeChangeSuccess', () => {
                $timeout(() => { // wait for DOM, then restore scroll position
                    $(window).scrollTop(this.scrollPos[$location.path()] ? this.scrollPos[$location.path()] : 0);
                    this.okSaveScroll = true;
                }, 0);
            });
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
            'ServantService'
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
            private servantService: ServantService
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
            'ServantService'
        ];

        public servant: any[];

        constructor(
            private $routeParams: ServantDetailParams,
            private servantService: ServantService
        ) {
            this.servant = null;

            servantService.loadServant($routeParams.id)
                .then((reason: any) => {
                    this.servant = reason.servant;
                });
        }
    }
}
