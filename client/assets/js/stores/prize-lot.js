import {EventEmitter} from 'events';
import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

const CHANGE_EVENT = 'change';

export default new (class PrizeLotStore extends EventEmitter {
  results = [];
  constructor() {
    super();

    AppDispatcher.register((action) => {
      switch (action.actionType) {
        case AppConstants.ActionTypes.DRAW_PRIZE_LOTS:
          this._draw(action);
          break;
      }
      this.emit(CHANGE_EVENT);
    });
  }
  _draw(action) {
    this.results = action.results;
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
})();
