'use strict';
var ServantModel = (function () {
    function ServantModel(obj) {
        this.id = obj.id;
        this.tribeId = obj.tribe_id;
        this.tribeName = obj.tribe_name;
        this.tribeCode = obj.tribe_code;
        this.type = obj.type;
        this.name = obj.name;
        this.cost = obj.cost;
        this.range = obj.range;
        this.releaseDate = new Date(obj.release_date);
        this.updateDate = new Date(obj.update_date);
        this.illustrationBy = obj.illustration_by;
        this.characterVoice = obj.character_voice;
        this.oralTradition = obj.oral_tradition;
        this.winRate = obj.win_rate;
        this.usedRate = obj.used_rate;
        if (obj.status) {
            this.status = {
                1: obj.status[1] ? new StatusModel(obj.status[1]) : null,
                20: obj.status[20] ? new StatusModel(obj.status[20]) : null
            };
        }
        if (obj.skill) {
            this.skill = {
                active: obj.skill.active ? new SkillModel(obj.skill.active) : null,
                passive: obj.skill.passive ? new SkillModel(obj.skill.passive) : null
            };
        }
    }
    Object.defineProperty(ServantModel.prototype, "tribeNameAndCode", {
        get: function () {
            return this.tribeName + '-' + ('000' + this.tribeCode).slice(-3);
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
