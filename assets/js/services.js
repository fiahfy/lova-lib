/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    var ServantService = (function () {
        function ServantService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.url = './assets/data/servant.json';
            this.servants = [];
        }
        ServantService.prototype.load = function () {
            var deferrd = this.$q.defer();
            var me = this;
            this.$http.get(this.url, { cache: true })
                .then(function (res) {
                me.servants = res.data;
                deferrd.resolve();
            }, function () {
                deferrd.reject();
            });
            return deferrd.promise;
        };
        ServantService.prototype.loadServants = function () {
            var deferrd = this.$q.defer();
            var me = this;
            this.load()
                .then(function () {
                deferrd.resolve({ servants: me.servants });
            });
            return deferrd.promise;
        };
        ServantService.prototype.loadServant = function (id) {
            var deferrd = this.$q.defer();
            var me = this;
            this.load()
                .then(function () {
                me.servants.forEach(function (servant) {
                    if (servant.id == id) {
                        deferrd.resolve({ servant: servant });
                    }
                });
            });
            return deferrd.promise;
        };
        ServantService.$inject = [
            '$http',
            '$q'
        ];
        return ServantService;
    })();
    lova.ServantService = ServantService;
})(lova || (lova = {}));
//# sourceMappingURL=services.js.map