import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

export default class ServantAction {
  static fetchAll() {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.FETCH_SERVANTS
    });
  }
}
