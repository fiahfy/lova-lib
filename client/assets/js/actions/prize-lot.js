import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

export default class PrizeLotAction {
  static draw(times) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.DRAW_PRIZE_LOTS,
      times: times
    });
  }
}
