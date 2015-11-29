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
        case AppConstants.ActionTypes.FETCH_SERVANT:
          this._fetchServant(action.id);
          break;
        case AppConstants.ActionTypes.FETCH_SERVANTS:
          this._fetchServants();
          break;
      }
    });
  }
  _fetchServant(id) {
    //if (this.getServant(id)) {
    //  this.emit(CHANGE_EVENT);
    //  return;
    //}
    fetch(`/api/servants/${id}/?with_statistic`)
      .then((response) => {
        return response.json();
      }).then((json) => {
      this.servants = [json];
      this.emit(CHANGE_EVENT);
    }).catch((error) => {
      console.error(error);
    });
  }
  _fetchServants() {
    //if (this.getServants().length) {
    //  this.emit(CHANGE_EVENT);
    //  return;
    //}
    fetch('/api/servants/?with_statistic')
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
  getServant(id) {
    return _.first(_.filter(this.servants, {id: id})) || null;
  }
  getServants() {
    return this.servants;
  }
})();
