/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    var ServantService = (function () {
        function ServantService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.servants = [];
        }
        ServantService.prototype.load = function () {
            var _this = this;
            var deferrd = this.$q.defer();
            if (this.servants.length) {
                deferrd.resolve();
                return deferrd.promise;
            }
            this.$http.get(ServantService.url)
                .then(function (res) {
                res.data.forEach(function (servant) {
                    _this.servants.push(new lova.ServantModel(servant));
                });
                deferrd.resolve();
            }, function () {
                deferrd.reject();
            });
            return deferrd.promise;
        };
        ServantService.prototype.getServantWithId = function (id) {
            var result = null;
            this.servants.forEach(function (servant) {
                if (servant.id == id) {
                    result = servant;
                }
            });
            return result;
        };
        ServantService.url = './assets/data/servant.json';
        ServantService.$inject = [
            '$http',
            '$q'
        ];
        return ServantService;
    })();
    lova.ServantService = ServantService;
    var DeckService = (function () {
        function DeckService($window) {
            this.$window = $window;
            this.servants = [];
            this.deck = new lova.DeckModel();
        }
        Object.defineProperty(DeckService.prototype, "url", {
            get: function () {
                var a = this.$window.document.createElement('a');
                a.href = this.$window.location.href;
                return a.protocol + '//'
                    + a.hostname + (a.port ? ':' + a.port : a.port)
                    + '/decks/' + this.deck.hash + '/';
            },
            enumerable: true,
            configurable: true
        });
        DeckService.prototype.loadWithHash = function (hash) {
            this.deck.hash = hash;
            this.deck.updateServants(this.servants);
        };
        DeckService.prototype.setServant = function (index, servantId) {
            this.deck.servantIds[index] = servantId;
            this.deck.updateServants(this.servants);
        };
        DeckService.prototype.unsetServant = function (index) {
            this.setServant(index, undefined);
        };
        DeckService.$inject = [
            '$window'
        ];
        return DeckService;
    })();
    lova.DeckService = DeckService;
    var ScrollService = (function () {
        function ScrollService($location, $window) {
            var _this = this;
            this.$location = $location;
            this.$window = $window;
            this.positions = {};
            angular.element($window).on('scroll', function () {
                _this.positions[_this.$location.path()] = angular.element($window).scrollTop();
            });
        }
        ScrollService.prototype.restore = function () {
            var top = this.positions[this.$location.path()] || 0;
            angular.element(this.$window).scrollTop(top);
        };
        ScrollService.$inject = [
            '$location',
            '$window'
        ];
        return ScrollService;
    })();
    lova.ScrollService = ScrollService;
})(lova || (lova = {}));
//# sourceMappingURL=services.js.map