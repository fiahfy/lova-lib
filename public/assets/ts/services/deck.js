'use strict';
//import * as angular from 'angular';
var app = require('../app');
var deck_1 = require('../models/deck');
var DeckService = (function () {
    function DeckService($window) {
        this.$window = $window;
    }
    DeckService.prototype.getDeckWithHash = function (hash, servants) {
        var deck = new deck_1.DeckModel();
        var servantIds = DeckService.decode(hash);
        for (var i = 0; i < deck_1.DeckModel.size; i++) {
            var servantId = servantIds[i];
            for (var _i = 0; _i < servants.length; _i++) {
                var servant = servants[_i];
                if (servant.id === servantId) {
                    deck.servants[i] = servant;
                    break;
                }
            }
        }
        return deck;
    };
    DeckService.prototype.getUrlWithDeck = function (deck) {
        var servantIds = deck.servants.map(function (servant) {
            return servant ? servant.id : undefined;
        });
        var a = this.$window.document.createElement('a');
        a.href = this.$window.location.href;
        return a.protocol + '//'
            + a.hostname + (a.port ? ':' + a.port : a.port)
            + '/deck/' + DeckService.encode(servantIds) + '/';
    };
    DeckService.encode = function (data) {
        return window.btoa(JSON.stringify(data));
    };
    DeckService.decode = function (encodedString) {
        try {
            return JSON.parse(window.atob(encodedString));
        }
        catch (e) {
            return [];
        }
    };
    DeckService.$inject = [
        '$window'
    ];
    return DeckService;
})();
exports.DeckService = DeckService;
angular.module(app.appName).service('DeckService', DeckService);
