import {EventEmitter} from 'events';
import fetch from 'whatwg-fetch';
import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

const CHANGE_EVENT = 'change';

export default new (class SpellStatisticStore extends EventEmitter {
  statistics = [];
  constructor() {
    super();

    AppDispatcher.register((action) => {
      switch (action.actionType) {
        case AppConstants.ActionTypes.FETCH_SPELL_STATISTICS:
          this._fetchSpellStatistics(action);
          break;
      }
    });
  }
  _fetchSpellStatistics(args) {
    this.emit(CHANGE_EVENT);

    let params = _.pick(args, (value, key) => {
      return ['spell_id', 'map', 'queue'].indexOf(key) > -1;
    });

    const url = '/api/spells/statistics/?term=month&' + _.map(params, (value, key) => {
      return `${key}=${value}`;
    }).join('&');

    fetch(url)
      .then((response) => {
        return response.json();
      }).then((json) => {
      this.statistics = _.reject(this.statistics, params).concat(json);
      this.emit(CHANGE_EVENT);
    }).catch((error) => {
      console.error(error);
    });
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  getSpellStatistics(args) {
    let params = _.pick(args, (value, key) => {
      return ['spell_id', 'map', 'queue'].indexOf(key) > -1;
    });

    return _.filter(this.statistics, params);
  }
})();
