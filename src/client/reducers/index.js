import * as ActionTypes from '../actions'

function servants(state = [], action) {
  switch (action.type) {
  case ActionTypes.RECEIVE_SERVANT: {
    const {servant} = action
    return state = _.reject(state, {id: servant.id}).concat([servant])
  }
  case ActionTypes.RECEIVE_SERVANTS: {
    const {servants} = action
    return state = servants
  }
  default:
    return state
  }
}

function prizes(state = [], action) {
  switch (action.type) {
  case ActionTypes.RECEIVE_PRIZES: {
    const {prizes} = action
    return state = prizes
  }
  default:
    return state
  }
}

function servantStatistics(state = [], action) {
  switch (action.type) {
  case ActionTypes.RECEIVE_SERVANT_STATISTICS: {
    const {params, servantStatistics} = action
    return state = _.reject(state, params).concat(servantStatistics)
  }
  default:
    return state
  }
}

function spellStatistics(state = [], action) {
  switch (action.type) {
  case ActionTypes.RECEIVE_SPELL_STATISTICS: {
    const {params, spellStatistics} = action
    return state = _.reject(state, params).concat(spellStatistics)
  }
  default:
    return state
  }
}

export default {
  servants,
  prizes,
  servantStatistics,
  spellStatistics
}
