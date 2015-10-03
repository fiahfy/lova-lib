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
  public illustrationBy: string;
  public characterVoice: string;
  public oralTradition: string;
  public status: {
    1: StatusModel;
    20: StatusModel;
  };
  public skill: {
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
    this.illustrationBy = obj.illustration_by;
    this.characterVoice = obj.character_voice;
    this.oralTradition  = obj.oral_tradition;
    this.status = {
      1:  obj.status[1]  ? new StatusModel(obj.status[1])  : null,
      20: obj.status[20] ? new StatusModel(obj.status[20]) : null
    };
    this.skill = {
      active:  obj.skill.active  ? new SkillModel(obj.skill.active)  : null,
      passive: obj.skill.passive ? new SkillModel(obj.skill.passive) : null
    }
  }
}

export class StatusModel {
  public hp: number;
  public ap: number;
  public atk: number;
  public pow: number;
  public def: number;
  public res: number;
  public ms: number;
  public as: number;

  constructor(obj: any) {
    this.hp  = obj.hp;
    this.ap  = obj.ap;
    this.atk = obj.atk;
    this.pow = obj.pow;
    this.def = obj.def;
    this.res = obj.res;
    this.ms  = obj.ms;
    this.as  = obj.as;
  }
}

export class SkillModel {
  public name: string;
  public designation: string;
  public effect: string;
  public description: string;
  public ap: string;
  public cd: string;

  constructor(obj: any) {
    this.name        = obj.name;
    this.designation = obj.designation;
    this.effect      = obj.effect;
    this.description = obj.description;
    this.ap          = obj.ap;
    this.cd          = obj.cd;
  }
}
