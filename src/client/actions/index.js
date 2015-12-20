import fetch from 'isomorphic-fetch'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'

export const RECEIVE_SERVANT = 'RECEIVE_SERVANT'
export const RECEIVE_SERVANTS = 'RECEIVE_SERVANTS'
export const RECEIVE_PRIZES = 'RECEIVE_PRIZES'
export const RECEIVE_SERVANT_STATISTICS = 'RECEIVE_SERVANT_STATISTICS'
export const RECEIVE_SPELL_STATISTICS = 'RECEIVE_SPELL_STATISTICS'

let apiBaseURL = ''
if (!ExecutionEnvironment.canUseDOM) {
  apiBaseURL = 'http://' + (process.env.OPENSHIFT_APP_DNS || 'localhost:3000')
}

export function fetchServant(id) {
  return dispatch => {
    return fetch(`${apiBaseURL}/api/servants/${id}/?with_statistic`)
      .then(response => response.json())
      .then(json => dispatch({
        type:    RECEIVE_SERVANT,
        servant: json
      }))
  }
}

export function fetchServants() {
  return dispatch => {
    return fetch(`${apiBaseURL}/api/servants/?with_statistic`)
      .then(response => response.json())
      .then(json => dispatch({
        type:     RECEIVE_SERVANTS,
        servants: json
      }))
  }
}

export function fetchPrizes() {
  return dispatch => {
    return fetch(`${apiBaseURL}/api/prizes/`)
      .then(response => response.json())
      .then(json => dispatch({
        type:   RECEIVE_PRIZES,
        prizes: json
      }))
  }
}

export function fetchServantStatistics(args) {
  return dispatch => {
    const params = _.pick(args, (value, key) => ['servant_id', 'map', 'queue'].indexOf(key) > -1)

    const url = `${apiBaseURL}/api/servants/statistics/?term=month&`
              + _.map(params, (value, key) => `${key}=${value}`).join('&')

    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch({
        type:              RECEIVE_SERVANT_STATISTICS,
        filter:            params,
        servantStatistics: json
      }))
  }
}

export function fetchSpellStatistics(args) {
  return dispatch => {
    const params = _.pick(args, (value, key) => ['spell_id', 'map', 'queue'].indexOf(key) > -1)

    const url = `${apiBaseURL}/api/spells/statistics/?term=month&`
              + _.map(params, (value, key) => `${key}=${value}`).join('&')

    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch({
        type:            RECEIVE_SPELL_STATISTICS,
        filter:          params,
        spellStatistics: json
      }))
  }
}
