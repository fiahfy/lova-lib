'use strict';
var DeckModel = (function () {
    function DeckModel() {
        this.servants = new Array(DeckModel.size);
    }
    Object.defineProperty(DeckModel.prototype, "mana", {
        get: function () {
            var fill = true;
            this.servants.forEach(function (e, i) {
                if (!e && DeckModel.deckIndexes.indexOf(i) > -1) {
                    fill = false;
                }
            });
            return fill ? 30 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeckModel.prototype, "bonusMana", {
        get: function () {
            var tribeIds = [];
            var fill = true;
            this.servants.forEach(function (e, i) {
                if (DeckModel.deckIndexes.indexOf(i) == -1) {
                    return;
                }
                if (!e) {
                    fill = false;
                    return;
                }
                if (tribeIds.indexOf(e.tribeId) == -1) {
                    tribeIds.push(e.tribeId);
                }
            });
            if (!fill) {
                return 0;
            }
            switch (tribeIds.length) {
                case 1:
                    return 10;
                case 2:
                    return 5;
                default:
                    return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeckModel.prototype, "totalMana", {
        get: function () {
            return this.servants.reduce(function (p, e, i) {
                if (e && DeckModel.deckIndexes.indexOf(i) > -1) {
                    return e.cost + p;
                }
                return p;
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    DeckModel.deckIndexes = [0, 1, 2, 3, 4, 5];
    DeckModel.sideBoardIndexes = [6, 7];
    DeckModel.size = DeckModel.deckIndexes.length + DeckModel.sideBoardIndexes.length;
    return DeckModel;
})();
exports.DeckModel = DeckModel;
