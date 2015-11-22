import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';
import PrizeStore from '../stores/prize';

export default class PrizeLotAction {
  static draw(times) {
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

    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.DRAW_PRIZE_LOTS,
      results: results
    });
  }
}
