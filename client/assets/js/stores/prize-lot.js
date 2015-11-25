import {EventEmitter} from 'events';
import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';
import PrizeStore from '../stores/prize';

const CHANGE_EVENT = 'change';

export default new (class PrizeLotStore extends EventEmitter {
  results = [];
  resultsSummary = [];
  constructor() {
    super();

    AppDispatcher.register((action) => {
      switch (action.actionType) {
        case AppConstants.ActionTypes.DRAW_PRIZE_LOTS:
          this._drawLots(action.times);
          break;
      }
    });
  }
  _drawLots(times) {
    const prizes = PrizeStore.prizes;

    let totalRate = 0;
    const lots = prizes.map((e) => {
      totalRate += e.rate;
      return {rate: totalRate, prize: e}
    });


    let results = [];
    for (let i = 0; i < times; i++) {
      const rate = Math.random() * totalRate;
      for (let j = 0; j < lots.length; j++) {
        const lot = lots[j];
        if (rate <= lot.rate) {
          results.push(lot.prize);
          break;
        }
      }
    }

    this.results = results;

    const summary = this.results.reduce((p, c) => {
      if (!p[c.id]) {
        p[c.id] = {prize: c, count: 0, rate: 0};
      }
      p[c.id].count++;
      p[c.id].rate = p[c.id].count / times;
      return p;
    }, {});
    this.resultsSummary = Object.keys(summary).map((id) => {
      return {
        prize: summary[id].prize,
        count: summary[id].count,
        rate: summary[id].rate
      };
    });

    this.emit(CHANGE_EVENT);
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  getResults() {
    return this.results;
  }
  getResultsSummary() {
    return this.resultsSummary;
  }
})();
