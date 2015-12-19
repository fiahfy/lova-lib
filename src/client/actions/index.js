import fetch from 'isomorphic-fetch'

export const RECEIVE_SERVANT = 'RECEIVE_SERVANT'
export const RECEIVE_SERVANTS = 'RECEIVE_SERVANTS'
export const RECEIVE_PRIZES = 'RECEIVE_PRIZES'
export const RECEIVE_SERVANT_STATISTICS = 'RECEIVE_SERVANT_STATISTICS'
export const RECEIVE_SPELL_STATISTICS = 'RECEIVE_SPELL_STATISTICS'

export function fetchServant(id) {
  return dispatch => {
    return fetch(`/api/servants/${id}/?with_statistic`)
      .then(response => response.json())
      .then(json => dispatch({
        type:    RECEIVE_SERVANT,
        servant: json
      }))
      .catch((error) => {
        console.error(error)
      })
  }
}

export function fetchServants() {
  return dispatch => {
    return fetch('/api/servants/?with_statistic')
      .then(response => response.json())
      .then(json => dispatch({
        type:     RECEIVE_SERVANTS,
        servants: json
      }))
      .catch((error) => {
        console.error(error)
      })
  }
}

export function fetchPrizes() {
  return dispatch => {
    return fetch('/api/prizes/')
      .then(response => response.json())
      .then(json => dispatch({
        type:   RECEIVE_PRIZES,
        prizes: json
      }))
      .catch((error) => {
        console.error(error)
      })
  }
}

export function fetchServantStatistics(args) {
  return dispatch => {
    const params = _.pick(args, (value, key) => ['servant_id', 'map', 'queue'].indexOf(key) > -1)

    const url = '/api/servants/statistics/?term=month&'
              + _.map(params, (value, key) => `${key}=${value}`).join('&')

    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch({
        type:              RECEIVE_SERVANT_STATISTICS,
        filter:            params,
        servantStatistics: json
      }))
      .catch((error) => {
        console.error(error)
      })
  }
}

export function fetchSpellStatistics(args) {
  return dispatch => {
    const params = _.pick(args, (value, key) => ['spell_id', 'map', 'queue'].indexOf(key) > -1)

    const url = '/api/spells/statistics/?term=month&'
              + _.map(params, (value, key) => `${key}=${value}`).join('&')

    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch({
        type:            RECEIVE_SPELL_STATISTICS,
        filter:          params,
        spellStatistics: json
      }))
      .catch((error) => {
        console.error(error)
      })
  }
}
