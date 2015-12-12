'use strict';
var DeckController = (function () {
    function DeckController($window, $location, $routeParams, servantService, deckService) {
        var _this = this;
        this.$window = $window;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.servantService = servantService;
        this.deckService = deckService;
        this.tribeIdOptions = [
            { key: 0, value: 'Select Tribe...' },
            { key: 1, value: '人獣' },
            { key: 2, value: '神族' },
            { key: 3, value: '魔種' },
            { key: 4, value: '海種' },
            { key: 5, value: '不死' }
        ];
        this.typeOptions = [
            { key: '', value: 'Select Type...' }
        ];
        this.tribeName = 'Select Tribe...';
        this.type = this.typeOptions[0].value;
        this.filter = {
            tribeId: undefined,
            type: undefined,
            name: undefined
        };
        this.predicate = ['tribeId', 'tribeCode'];
        this.reverse = false;
        servantService.load()
            .then(function (servants) {
            _this.servants = servants;
            _this.deck = deckService.getDeckWithHash($routeParams.hash, servants);
            _this.url = deckService.getUrlWithDeck(_this.deck);
            _this.buildOptions();
        });
        angular.element($window.document).ready(function () {
            var button = angular.element('.copy-clipboard');
            var clip = new ZeroClipboard(button);
            clip.on('ready', function () {
                clip.on('aftercopy', function () {
                    button
                        .attr('data-original-title', 'Copied')
                        .tooltip('show');
                    $window.setTimeout(function () {
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
    DeckController.prototype.buildOptions = function () {
        for (var _i = 0, _a = this.servants; _i < _a.length; _i++) {
            var servant = _a[_i];
            var optionKeys = this.typeOptions.map(function (option) {
                return option.key;
            });
            if (optionKeys.indexOf(servant.type) == -1) {
                this.typeOptions.push({ key: servant.type, value: servant.type });
            }
        }
        // todo: type 毎の total count も表示
    };
    DeckController.prototype.setServant = function (index, data) {
        var servant = data.servant;
        var oldIndex = data.index;
        if (oldIndex !== null) {
            this.deck.servants[oldIndex] = this.deck.servants[index] ? this.deck.servants[index] : undefined;
        }
        this.deck.servants[index] = servant;
        this.url = this.deckService.getUrlWithDeck(this.deck);
    };
    DeckController.prototype.clearServant = function (index) {
        this.deck.servants[index] = undefined;
        this.url = this.deckService.getUrlWithDeck(this.deck);
    };
    DeckController.prototype.selectTribeId = function (tribeId, tribeName) {
        this.tribeId = tribeId;
        this.tribeName = tribeName;
        this.filter.tribeId = this.tribeId ? this.tribeId : undefined;
        this.flashLazyLoad();
    };
    DeckController.prototype.selectType = function (type, typeName) {
        this.type = typeName;
        this.filter.type = type ? type : undefined;
        this.flashLazyLoad();
    };
    DeckController.prototype.changeQuery = function () {
        this.filter.name = this.q;
        this.flashLazyLoad();
    };
    DeckController.prototype.openServant = function (servantId) {
        this.$window.open('/servants/' + servantId + '/', '_blank');
    };
    DeckController.prototype.flashLazyLoad = function () {
        // force call scroll event
        var top = angular.element(this.$window.document).scrollTop();
        angular.element(this.$window.document).scrollTop(top + 1);
        angular.element(this.$window.document).scrollTop(top);
    };
    DeckController.$inject = [
        '$window',
        '$location',
        '$routeParams',
        'ServantService',
        'DeckService'
    ];
    return DeckController;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: DeckController,
            controllerAs: 'c',
            restrict: 'E',
            templateUrl: '/assets/templates/deck.html'
        };
    };
    return Definition;
})();
angular.module('app').directive('lovaDeck', Definition.ddo);
