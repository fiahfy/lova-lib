import {EventEmitter} from 'events';
import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

const CHANGE_EVENT = 'change';

export default new (class PrizeStore extends EventEmitter {
  prizes = [];
  constructor() {
    super();

    AppDispatcher.register((action) => {
      switch (action.actionType) {
        case AppConstants.ActionTypes.RECEIVE_PRIZES:
          this._receive(action);
          break;
      }
      this.emit(CHANGE_EVENT);
    });
  }
  _receive(action) {
    this.prizes = action.prizes;
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
})();
