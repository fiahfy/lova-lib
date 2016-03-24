import moment from 'moment'
import logger from '../utils/logger'
import * as models from '../models'

export default function() {
  return new Promise(async function(resolve, reject) {
    try {
      await setupServants()
      await setupPrizes()
      await setupCombinations()
      await setupSpellRankings()
      await setupServantRankings()
      await setupCounters()
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

async function setupServants() {
  logger.verbose('Setup Servant Data...')

  await models.servant.remove({}).exec()

  const template = {
    _id: 1,
    tribe_id: 1,
    tribe_name: 'bst',
    tribe_code: 1,
    type: 'type1',
    name: 'Servant 1',
    cost: 10,
    range: 350,
    release_date: new Date,
    update_date: new Date,
    illustration_by: 'Illustrator 1',
    character_voice: 'CV 1',
    oral_tradition: 'DESC',
    skill: {
      active: {
        name: 'Active 1',
        designation: 'Designation 1',
        effect: 'Effect 1',
        description: 'DESC',
        ap: [10, 20, 30],
        cd: [15, 10, 5]
      },
      passive: {
        name: 'Passive 1',
        designation: 'Designation 1',
        effect: 'Effect 1',
        description: 'DESC',
        ap: [10, 20, 30],
        cd: [15, 10, 5]
      }
    },
    status: {
      1: {
        hp: 100,
        ap: 0,
        atk: 10,
        pow: 0,
        def: 10,
        res: 10,
        ms: 10,
        as: 0.5
      },
      20: {
        hp: 1000,
        ap: 0,
        atk: 100,
        pow: 0,
        def: 100,
        res: 100,
        ms: 100,
        as: 0.8
      }
    }
  }

  let servant

  servant = new models.servant(Object.assign(template, {}))
  await servant.save()

  servant = new models.servant(Object.assign(template, {
    _id: 2,
    name: 'Servant 2'
  }))
  await servant.save()

  servant = new models.servant(Object.assign(template, {
    _id: 3,
    tribe_id: 2,
    tribe_name: 'hly',
    name: 'Servant 3'
  }))
  await servant.save()

  servant = new models.servant(Object.assign(template, {
    _id: 4,
    tribe_id: 3,
    tribe_name: 'dmn',
    name: 'Servant 4'
  }))
  await servant.save()

  servant = new models.servant(Object.assign(template, {
    _id: 5,
    tribe_id: 4,
    tribe_name: 'sea',
    name: 'Servant 5'
  }))
  await servant.save()

  logger.verbose('Done.')
}

async function setupPrizes() {
  logger.verbose('Setup Prize Data...')

  await models.prize.remove({}).exec()

  for (let i = 0; i < 10; i++) {
    const prize = new models.prize({
      _id: i,
      name: `Prize ${i}`,
      rate: 0.01 * (i + 1),
      date: new Date
    })
    await prize.save()
  }

  logger.verbose('Done.')
}

async function setupCombinations() {
  logger.verbose('Setup Combination Data...')

  await models.combination.remove({}).exec()

  let combination

  combination = new models.combination({
    _id: 1,
    servant_ids: [1, 2, 3, 4]
  })
  await combination.save()

  combination = new models.combination({
    _id: 2,
    servant_ids: [1, 2, 3, 5]
  })
  await combination.save()

  logger.verbose('Done.')
}

async function setupSpellRankings() {
  logger.verbose('Setup Spell Ranking Data...')

  await models.spellRanking.remove({}).exec()

  let id = 0
  for (let spellId = 1; spellId <= 5; spellId++) {
    for (let map of ['all', 'vermilion', 'braze']) {
      for (let queue of ['all', 'normal', 'solo']) {
        for (let i = -100; i < 0; i++) {
          const ranking = new models.spellRanking({
            _id: id++,
            date: moment.utc().subtract(i, 'days').startOf('day'),
            map,
            queue,
            spell_id: spellId,
            seq: 0,
            rank: 0,
            score: Math.floor(Math.random() * 100) / 100
          })
          await ranking.save()
        }
      }
    }
  }

  logger.verbose('Done.')
}

async function setupServantRankings() {
  logger.verbose('Setup Servant Ranking Data...')

  await models.servantRanking.remove({}).exec()

  let id = 0
  for (let servantId = 1; servantId <= 4; servantId++) {
    for (let map of ['all', 'vermilion', 'braze']) {
      for (let queue of ['all', 'normal', 'solo']) {
        for (let mode of ['win', 'usage']) {
          for (let i = -100; i < 0; i++) {
            const ranking = new models.servantRanking({
              _id: id++,
              date: moment.utc().subtract(i, 'days').startOf('day'),
              mode,
              map,
              queue,
              servant_id: servantId,
              seq: 0,
              rank: 0,
              score: Math.floor(Math.random() * 5) / 100
            })
            await ranking.save()
          }
        }
      }
    }
  }

  logger.verbose('Done.')
}

async function setupCounters() {
  logger.verbose('Setup Counter Data...')

  await models.counter.remove({}).exec()

  let counter, count

  count = await models.servant.find().count().exec()
  counter = new models.counter({_id: 'servant', seq: count})
  await counter.save()

  count = await models.prize.find().count().exec()
  counter = new models.counter({_id: 'prize', seq: count})
  await counter.save()

  count = await models.combination.find().count().exec()
  counter = new models.counter({_id: 'combination', seq: count})
  await counter.save()

  count = await models.spellRanking.find().count().exec()
  counter = new models.counter({_id: 'spellRanking', seq: count})
  await counter.save()

  count = await models.servantRanking.find().count().exec()
  counter = new models.counter({_id: 'servantRanking', seq: count})
  await counter.save()

  logger.verbose('Done.')
}
