export function drawPrizes(prizes, times) {
  let totalRate = 0
  const lots = prizes.map(prize => {
    totalRate += prize.rate
    return {rate: totalRate, prize: prize}
  })

  let results = []
  for (let i = 0; i < times; i++) {
    const rate = Math.random() * totalRate
    for (let lot of lots) {
      if (rate <= lot.rate) {
        results.push(lot.prize)
        break
      }
    }
  }

  const summary = results.reduce((previous, current) => {
    const id = current.id
    if (!previous[id]) {
      previous[id] = {prize: current, count: 0, rate: 0}
    }
    previous[id].count++
    previous[id].rate = previous[id].count / times
    return previous
  }, {})

  const resultsSummary = _.values(summary, item => {
    return {
      prize: item.prize,
      count: item.count,
      rate:  item.rate
    }
  }).sort((a, b) => {
    return b.count - a.count
  })

  return {
    results,
    resultsSummary
  }
}
