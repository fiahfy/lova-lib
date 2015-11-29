import {EventEmitter} from 'events';
import fetch from 'whatwg-fetch';
import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

const CHANGE_EVENT = 'change';

export default new (class PrizeStore extends EventEmitter {
  prizes = [];
  constructor() {
    super();

    AppDispatcher.register((action) => {
      switch (action.actionType) {
        case AppConstants.ActionTypes.FETCH_PRIZES:
          this._fetchPrizes();
          break;
      }
    });
  }
  _fetchPrizes() {
    this.emit(CHANGE_EVENT);

    fetch('/api/prizes/')
      .then((response) => {
        return response.json();
      }).then((json) => {
        this.prizes = json;
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
  getPrizes() {
    return this.prizes;
  }
})();
