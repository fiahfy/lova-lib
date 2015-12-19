import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'

export function getMana(cards) {
  const fill = _.range(0, 6).every(index => !!cards[index])
  return fill ? 30 : 0
}

export function getBonusMana(cards) {
  const mana = getMana(cards)
  if (!mana) {
    return 0
  }
  const tribeIds = _.range(0, 6).reduce((previous, current) => {
    const card = cards[current]
    if (!card) {
      return previous
    }
    if (previous.indexOf(card.tribe_id) === -1) {
      previous.push(card.tribe_id)
    }
    return previous
  }, [])
  switch (tribeIds.length) {
    case 1:
      return 10
    case 2:
      return 5
    default:
      return 0
  }
}

export function getTotalMana(cards) {
  return _.range(0, 6).reduce((previous, current) => {
    const card = cards[current]
    if (!card) {
      return previous
    }
    return previous + card.cost
  }, 0)
}

export function getURL(cardIds) {
  return 'http://localhost:3000/deck/' + getHash(cardIds) + '/'
}

export function getHash(cardIds) {
  cardIds = _.range(0, 8).map(index => cardIds[index] || 0)
  return btoa(JSON.stringify(cardIds))
}

export function getCardIds(hash) {
  if (!hash) {
    return []
  }
  let cardIds = []
  try {
    cardIds = JSON.parse(atob(hash))
  } catch (e) {
    console.warn(`Invalid Deck Hash: ${hash}`)
    return []
  }

  return _.range(0, 8).map(index => cardIds[index])
}

function atob(hash) {
  if (ExecutionEnvironment.canUseDOM) {
    return window.atob(hash)
  }
  return new Buffer(str, 'base64').toString('binary')
}

function btoa(str) {
  if (ExecutionEnvironment.canUseDOM) {
    return window.btoa(str)
  }
  let buffer;
  if (Buffer.isBuffer(str)) {
    buffer = str;
  } else {
    buffer = new Buffer(str.toString(), 'binary');
  }
  return buffer.toString('base64');
}
