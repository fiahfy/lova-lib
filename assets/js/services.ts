/// <reference path="_all.ts" />

module lova {
    'use strict';

    export class ServantService {
        private url = './assets/data/servant.json';
        private servants = [];

        public static $inject = [
            '$http',
            '$q'
        ];

        constructor(
            private $http: angular.IHttpService,
            private $q: angular.IQService
        ) {
        }

        public load() {
            var deferrd = this.$q.defer();
            var me = this;
            this.$http.get(this.url, {cache: true})
                .then(function(res: any) {
                    me.servants = res.data;
                    deferrd.resolve();
                }, function() {
                    deferrd.reject();
                });
            return deferrd.promise;
        }

        public loadServants() {
            var deferrd = this.$q.defer();
            var me = this;
            this.load()
                .then(function() {
                    deferrd.resolve({servants: me.servants});
                });
            return deferrd.promise;
        }

        public loadServant(id) {
            var deferrd = this.$q.defer();
            var me = this;
            this.load()
                .then(function() {
                    me.servants.forEach(function(servant) {
                        if (servant.id == id) {
                            deferrd.resolve({servant: servant});
                        }
                    });
                });
            return deferrd.promise;
        }
    }
}
