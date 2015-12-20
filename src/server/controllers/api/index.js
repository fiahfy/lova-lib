export default (function *() {
  this.body = {node_version: process.version}
})

export {default as servant} from './servant'
export {default as prize} from './prize'
export {default as servantStatistics} from './servant-statistics'
export {default as spellStatistics} from './spell-statistics'
