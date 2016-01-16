const tribes = [
  null,
  '人獣',
  '神族',
  '魔種',
  '海種',
  '不死'
]

export function getTribeName(id) {
  return tribes[id] || 'Unknown'
}

export function getTribeIdWithName(name) {
  return tribes.indexOf(name)
}

function getServantSortId(tribeId, tribeCode) {
  return tribeId * 1000 + tribeCode
}

function getServantSortIdWithTribeString(str) {
  let [name, code] = str.split('-')
  const id = getTribeIdWithName(name)
  code = Number(code)
  return getServantSortId(id, code)
}

function getServantSortIdWithServant(servant) {
  return getServantSortId(servant.tribe_id, servant.tribe_code)
}

export function compareTribeString(a, b) {
  const aNumber = getServantSortIdWithTribeString(a)
  const bNumber = getServantSortIdWithTribeString(b)
  return ((aNumber < bNumber) ? -1 : ((aNumber > bNumber) ? 1 : 0))
}

export function compareServant(a, b) {
  const aNumber = getServantSortIdWithServant(a)
  const bNumber = getServantSortIdWithServant(b)
  return ((aNumber < bNumber) ? -1 : ((aNumber > bNumber) ? 1 : 0))
}
