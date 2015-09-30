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
        this.illustrationBy = obj.illustration_by;
        this.characterVoice = obj.character_voice;
        this.oralTradition = obj.oral_tradition;
        this.status = {
            1: obj.status[1] ? new StatusModel(obj.status[1]) : null,
            20: obj.status[20] ? new StatusModel(obj.status[20]) : null
        };
        this.skill = {
            active: obj.skill.active ? new SkillModel(obj.skill.active) : null,
            passive: obj.skill.passive ? new SkillModel(obj.skill.passive) : null
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
exports.ServantModel = ServantModel;
var StatusModel = (function () {
    function StatusModel(obj) {
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
exports.StatusModel = StatusModel;
var SkillModel = (function () {
    function SkillModel(obj) {
        this.name = obj.name;
        this.designation = obj.designation;
        this.effect = obj.effect;
        this.description = obj.description;
        this.ap = obj.ap;
        this.cd = obj.cd;
    }
    return SkillModel;
})();
exports.SkillModel = SkillModel;
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
exports.DeckModel = DeckModel;
var PrizeModel = (function () {
    function PrizeModel(obj) {
        this.id = obj.id;
        this.date = new Date(obj.date);
        this.name = obj.name;
        this.rate = obj.rate;
    }
    return PrizeModel;
})();
exports.PrizeModel = PrizeModel;
