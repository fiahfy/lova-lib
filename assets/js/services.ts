/// <reference path="_all.ts" />

module lova {
    'use strict';

    export class ServantService {
        private url: string = './assets/data/servant.json';
        public servants: ServantModel[] = [];

        public static $inject = [
            '$http',
            '$q'
        ];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService
        ) {
        }

        public load(): ng.IPromise<any> {
            let deferrd = this.$q.defer();
            if (this.servants.length) {
                deferrd.resolve();
                return deferrd.promise;
            }
            this.$http.get(this.url)
                .then((res: any) => {
                    res.data.forEach((servant) => {
                        this.servants.push(new ServantModel(servant));
                    });
                    deferrd.resolve();
                }, () => {
                    deferrd.reject();
                });
            return deferrd.promise;
        }

        public getServantWithId(id: number) {
            let result = null;
            this.servants.forEach((servant) => {
                if (servant.id == id) {
                    result = servant;
                }
            });
            return result;
        }
    }

    export class ScrollService {
        private positions: any = {};

        public static $inject = [
            '$location',
            '$window'
        ];

        constructor(
            private $location: ng.ILocationService,
            private $window: ng.IWindowService
        ) {
            angular.element($window).on('scroll', () => {
                this.positions[this.$location.path()] = angular.element($window).scrollTop();
            });
        }

        public restore(): void {
            let top = this.positions[this.$location.path()] || 0;
            angular.element(this.$window).scrollTop(top);
        }
    }
}
