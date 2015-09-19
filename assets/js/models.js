/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    var ServantModel = (function () {
        function ServantModel(obj) {
            this.id = obj.id;
            this.raceId = obj.race_id;
            this.raceName = obj.race_name;
            this.raceCode = obj.race_code;
            this.type = obj.type;
            this.name = obj.name;
            this.cost = obj.cost;
            this.range = obj.range;
            this.date = new Date(obj.date);
            this.illust = obj.illust;
            this.cv = obj.cv;
            this.oralTradition = obj.oral_tradition;
            this.statuses = {
                1: obj.statuses[1] ? new StatusModel(obj.statuses[1]) : null,
                20: obj.statuses[20] ? new StatusModel(obj.statuses[20]) : null
            };
            this.skills = {
                active: obj.skills.active ? new SkillModel(obj.skills.active) : null,
                passive: obj.skills.passive ? new SkillModel(obj.skills.passive) : null
            };
        }
        Object.defineProperty(ServantModel.prototype, "raceNameAndCode", {
            get: function () {
                return this.raceName + '-' + ('000' + this.raceCode).slice(-3);
            },
            enumerable: true,
            configurable: true
        });
        return ServantModel;
    })();
    lova.ServantModel = ServantModel;
    var StatusModel = (function () {
        function StatusModel(obj) {
            this.servantId = obj.servant_id;
            this.raceId = obj.race_id;
            this.raceName = obj.race_name;
            this.raceCode = obj.race_code;
            this.level = obj.level;
            this.hp = obj.hp;
            this.ap = obj.ap;
            this.atk = obj.atk;
            this.pow = obj.pow;
            this.def = obj.def;
            this.res = obj.res;
            this.ms = obj.ms;
            this.as = obj.as;
        }
        return StatusModel;
    })();
    lova.StatusModel = StatusModel;
    var SkillModel = (function () {
        function SkillModel(obj) {
            this.servantId = obj.servant_id;
            this.raceId = obj.race_id;
            this.raceName = obj.race_name;
            this.raceCode = obj.race_code;
            this.type = obj.type;
            this.name = obj.name;
            this.designation = obj.designation;
            this.effect = obj.effect;
            this.description = obj.description;
            this.ap = obj.ap;
            this.cd = obj.cd;
            this.range = obj.range;
            this.angle = obj.angle;
        }
        return SkillModel;
    })();
    lova.SkillModel = SkillModel;
    var DeckModel = (function () {
        function DeckModel() {
            this.servants = [];
            this.servantIds = [];
        }
        Object.defineProperty(DeckModel.prototype, "hash", {
            get: function () {
                return window.btoa(JSON.stringify(this.servantIds));
            },
            set: function (value) {
                try {
                    this.servantIds = JSON.parse(window.atob(value));
                }
                catch (e) {
                    this.servantIds = [];
                }
            },
            enumerable: true,
            configurable: true
        });
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
                var raceIds = [];
                var fill = true;
                this.servants.forEach(function (e, i) {
                    if (DeckModel.deckIndexes.indexOf(i) == -1) {
                        return;
                    }
                    if (!e) {
                        fill = false;
                        return;
                    }
                    if (raceIds.indexOf(e.raceId) == -1) {
                        raceIds.push(e.raceId);
                    }
                });
                if (!fill) {
                    return 0;
                }
                switch (raceIds.length) {
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
        DeckModel.prototype.updateServants = function (servants) {
            this.servants = [];
            for (var i = 0; i < DeckModel.size; i++) {
                var servantId = this.servantIds[i];
                var tmp = void 0;
                for (var j = 0; j < servants.length; j++) {
                    var servant = servants[j];
                    if (servantId == servant.id) {
                        tmp = servant;
                        break;
                    }
                }
                this.servants.push(tmp);
            }
        };
        DeckModel.deckIndexes = [0, 1, 2, 3, 4, 5];
        DeckModel.sideBoardIndexes = [6, 7];
        DeckModel.size = DeckModel.deckIndexes.length + DeckModel.sideBoardIndexes.length;
        return DeckModel;
    })();
    lova.DeckModel = DeckModel;
})(lova || (lova = {}));
//# sourceMappingURL=models.js.map