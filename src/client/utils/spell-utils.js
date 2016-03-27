const spellNames = [
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
  return spellNames[id] || 'Unknown'
}

export function getSpellIdWithName(name) {
  return spellNames.indexOf(name) || 0
}
