/// <reference path="_all.ts" />

module lova {
    'use strict';

    export class ServantService {
        private static url: string = './assets/data/servant.json';
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
            this.$http.get(ServantService.url)
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
            let result: ServantModel = null;
            this.servants.forEach((servant) => {
                if (servant.id == id) {
                    result = servant;
                }
            });
            return result;
        }
    }

    export class DeckService {
        public servants: ServantModel[] = [];
        public deck: DeckModel;

        public get url(): string {
            let a = this.$window.document.createElement('a');
            a.href = this.$window.location.href;
            return a.protocol + '//'
                + a.hostname + (a.port ? ':' + a.port : a.port)
                + '/decks/' + this.deck.hash + '/';
        }

        public static $inject = [
            '$window'
        ];

        constructor(
            private $window: ng.IWindowService
        ) {
            this.deck = new DeckModel();
        }

        public loadWithHash(hash: string) {
            this.deck.hash = hash;
            this.deck.updateServants(this.servants);
        }

        public setServant(index: number, servantId: number) {
            this.deck.servantIds[index] = servantId;
            this.deck.updateServants(this.servants);
        }

        public unsetServant(index: number) {
            this.setServant(index, undefined);
        }
    }

    export class ScrollService {
        private positions: { [index: string]: number; } = {};

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
