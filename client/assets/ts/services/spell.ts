'use strict';

//import * as angular from 'angular';
import * as app from '../app';

export class SpellService {
  public static $inject = [
  ];

  constructor(
  ) {
  }

  public static getSpellNameWithId(spellId: number): string {
    return [,
      'キュアオール',
      'リターンゲート',
      'パワーライズ',
      'クイックドライブ',
      'リザレクション',
      'フォースフィールド',
      'クレアボヤンス',
      'クロノフリーズ',
      'リモートサモン'
    ][spellId] || 'unknown';
  }
}

angular.module(app.appName).service('SpellService', SpellService);
