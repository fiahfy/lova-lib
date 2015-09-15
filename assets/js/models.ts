/// <reference path="_all.ts" />

module lova {
    'use strict';

    export class ServantModel {
        public id: number;
        public raceId: number;
        public raceName: string;
        public raceCode: number;
        public type: string;
        public name: string;
        public cost: number;
        public range: number;
        public date: Date;
        public illust: string;
        public cv: string;
        public oralTradition: string;
        public statuses: {
            1: StatusModel;
            20: StatusModel;
        };
        public skills: {
            active: SkillModel;
            passive: SkillModel;
        };
        public get raceNameAndCode(): string {
            return this.raceName + '-' + ('000' + this.raceCode).slice(-3);
        }

        constructor(obj: any) {
            this.id             = obj.id;
            this.raceId         = obj.race_id;
            this.raceName       = obj.race_name;
            this.raceCode       = obj.race_code;
            this.type           = obj.type;
            this.name           = obj.name;
            this.cost           = obj.cost;
            this.range          = obj.range;
            this.date           = new Date(obj.date);
            this.illust         = obj.illust;
            this.cv             = obj.cv;
            this.oralTradition  = obj.oral_tradition;
            this.statuses = {
                1:  obj.statuses[1]  ? new StatusModel(obj.statuses[1])  : null,
                20: obj.statuses[20] ? new StatusModel(obj.statuses[20]) : null
            };
            this.skills = {
                active:  obj.skills.active  ? new SkillModel(obj.skills.active)  : null,
                passive: obj.skills.passive ? new SkillModel(obj.skills.passive) : null
            }
        }
    }

    export class StatusModel {
        public servantId: number;
        public raceId: number;
        public raceName: string;
        public raceCode: number;
        public level: number;
        public hp: number;
        public ap: number;
        public atk: number;
        public pow: number;
        public def: number;
        public res: number;
        public ms: number;
        public as: number;

        constructor(obj: any) {
            this.servantId  = obj.servant_id;
            this.raceId     = obj.race_id;
            this.raceName   = obj.race_name;
            this.raceCode   = obj.race_code;
            this.level      = obj.level;
            this.hp         = obj.hp;
            this.ap         = obj.ap;
            this.atk        = obj.atk;
            this.pow        = obj.pow;
            this.def        = obj.def;
            this.res        = obj.res;
            this.ms         = obj.ms;
            this.as         = obj.as;
        }
    }

    export class SkillModel {
        public servantId: number;
        public raceId: number;
        public raceName: string;
        public raceCode: number;
        public type: string;
        public name: string;
        public designation: string;
        public effect: string;
        public description: string;
        public ap: string;
        public cd: string;
        public range: number;
        public angle: number;

        constructor(obj: any) {
            this.servantId      = obj.servant_id;
            this.raceId         = obj.race_id;
            this.raceName       = obj.race_name;
            this.raceCode       = obj.race_code;
            this.type           = obj.type;
            this.name           = obj.name;
            this.designation    = obj.designation;
            this.effect         = obj.effect;
            this.description    = obj.description;
            this.ap             = obj.ap;
            this.cd             = obj.cd;
            this.range          = obj.range;
            this.angle          = obj.angle;
        }
    }
}
