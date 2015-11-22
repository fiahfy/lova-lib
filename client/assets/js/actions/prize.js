import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

export default class PrizeAction {
  static fetch() {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.FETCH_PRIZES
    });
  }
}
