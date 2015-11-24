import {EventEmitter} from 'events';
import fetch from 'whatwg-fetch';
import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

const CHANGE_EVENT = 'change';

export default new (class ServantStore extends EventEmitter {
  servants = [];
  constructor() {
    super();

    AppDispatcher.register((action) => {
      switch (action.actionType) {
        case AppConstants.ActionTypes.FETCH_SERVANTS:
          this._fetchAll(action);
          break;
      }
    });
  }
  _fetchAll(action) {
    fetch('/api/servants/?with_statistic&fields=-oral_tradition')
      .then((response) => {
        return response.json();
      }).then((json) => {
        this.servants = json;
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
})();
