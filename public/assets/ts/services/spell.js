'use strict';
//import * as angular from 'angular';
var app = require('../app');
var SpellService = (function () {
    function SpellService() {
    }
    SpellService.getSpellNameWithId = function (spellId) {
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
    };
    SpellService.$inject = [];
    return SpellService;
})();
exports.SpellService = SpellService;
angular.module(app.appName).service('SpellService', SpellService);
