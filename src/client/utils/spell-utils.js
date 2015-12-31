export function getSpellName(id) {
  return [
      null,
      'キュアオール',
      'リターンゲート',
      'パワーライズ',
      'クイックドライブ',
      'リザレクション',
      'フォースフィールド',
      'クレアボヤンス',
      'クロノフリーズ',
      'リモートサモン'
    ][id] || 'Unknown'
}
