const spells = [
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
]

export function getSpellName(id) {
  return spells[id] || 'Unknown'
}
