import 'babel-polyfill'
import mongoose from 'mongoose'
import commander from 'commander'
import * as updateCommands from './server/commands/update'
import * as downloadCommands from './server/commands/download'
import * as spriteCommands from './server/commands/sprite'
import logger from './server/utils/logger'

let promise = null

commander
  .command('update-servant [url]')
  .alias('ups')
  .description('update servant data')
  .option('-f, --force', 'force update', null, null)
  .action((url, opts) => {
    promise = updateCommands.servant(url, opts.force)
  })

commander
  .command('update-prize')
  .alias('upp')
  .description('update prize data')
  .option('-f, --force', 'force update', null, null)
  .action(opts =>  {
    promise = updateCommands.prize(opts.force)
  })

commander
  .command('update-ranking-servant')
  .alias('uprs')
  .description('update ranking servant data')
  .option('-d, --date [date]', 'target date', null, null)
  .option('--date-from [date]', 'target date from', null, null)
  .option('--date-to [date]', 'target date to', null, null)
  .option('-f, --force', 'force update', null, null)
  .action(opts => {
    promise = updateCommands.servantRanking(opts.date, opts.dateFrom, opts.dateTo, opts.force)
  })

commander
  .command('update-ranking-spell')
  .alias('uprp')
  .description('update ranking spell data')
  .option('-d, --date [date]', 'target date', null, null)
  .option('--date-from [date]', 'target date from', null, null)
  .option('--date-to [date]', 'target date to', null, null)
  .option('-f, --force', 'force update', null, null)
  .action(opts => {
    promise = updateCommands.spellRanking(opts.date, opts.dateFrom, opts.dateTo, opts.force)
  })

commander
  .command('download-servant')
  .alias('dls')
  .description('download servant images')
  .option('-i, --id [id]', 'target servant id', null, null)
  .option('-f, --force', 'force download', null, null)
  .action(opts => {
    promise = downloadCommands.servant(opts.id, opts.force)
  })

commander
  .command('sprite-servant')
  .alias('sps')
  .description('create servant sprite image')
  .action(() => {
    promise = spriteCommands.servant()
  })

commander
  .version('0.0.1')
  .parse(process.argv)

if (!promise) {
  commander.help()
}

promise.then(() => {
  mongoose.disconnect()
}, (reason) => {
  mongoose.disconnect()
  logger.error(reason.message)
  logger.error(reason.stack)
})
