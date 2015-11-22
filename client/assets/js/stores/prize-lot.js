import {EventEmitter} from 'events';
import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';
import PrizeStore from '../stores/prize';

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
    });
  }
  _draw(action) {
    let times = action.times;
    let prizes = PrizeStore.prizes;

    let totalRate = 0;
    let lots = prizes.map((e) => {
      totalRate += e.rate;
      return {rate: totalRate, prize: e}
    });


    let results = [];
    for (let i = 0; i < times; i++) {
      let rate = Math.random() * totalRate;
      for (let j = 0; j < lots.length; j++) {
        let lot = lots[j];
        if (rate <= lot.rate) {
          results.push(lot.prize);
          break;
        }
      }
    }

    this.results = results;
    this.emit(CHANGE_EVENT);
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
})();
