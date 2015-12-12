import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

export default class PrizeAction {
  static fetchPrizes() {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.FETCH_PRIZES
    });
  }
}
