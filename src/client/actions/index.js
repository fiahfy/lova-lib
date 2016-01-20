import fetch from 'isomorphic-fetch'
import config from '../../config'

export const RECEIVE_SERVANT = 'RECEIVE_SERVANT'
export const RECEIVE_SERVANTS = 'RECEIVE_SERVANTS'
export const RECEIVE_PRIZES = 'RECEIVE_PRIZES'
export const RECEIVE_SERVANT_STATISTICS = 'RECEIVE_SERVANT_STATISTICS'
export const RECEIVE_SPELL_STATISTICS = 'RECEIVE_SPELL_STATISTICS'

let apiBaseURL = ''
if (config.target === 'server') {
  apiBaseURL = `http://localhost:${config.app.port}`
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
    const params = _.pick(args, (value, key) => ['servant_id', 'map', 'queue', 'period'].indexOf(key) > -1)

    const url = `${apiBaseURL}/api/servants/statistics/?`
              + _.map(params, (value, key) => `${key}=${value}`).join('&')

    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch({
        type:              RECEIVE_SERVANT_STATISTICS,
        params:            params,
        servantStatistics: json.map(item => {
          item.period = args.period
          return item
        })
      }))
  }
}

export function fetchSpellStatistics(args) {
  return dispatch => {
    const params = _.pick(args, (value, key) => ['spell_id', 'map', 'queue', 'period'].indexOf(key) > -1)

    const url = `${apiBaseURL}/api/spells/statistics/?`
              + _.map(params, (value, key) => `${key}=${value}`).join('&')

    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch({
        type:            RECEIVE_SPELL_STATISTICS,
        params:          params,
        spellStatistics: json.map(item => {
          item.period = args.period
          return item
        })
      }))
  }
}
