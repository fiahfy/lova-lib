import {EventEmitter} from 'events';

export default new (class SpellStore extends EventEmitter {
  getSpellName(id) {
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
      ][id] || 'unknown';
  }
})();
