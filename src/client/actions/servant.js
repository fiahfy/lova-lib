import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

export default class ServantAction {
  static fetchServant(id) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.FETCH_SERVANT,
      id: id
    });
  }
  static fetchServants() {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.FETCH_SERVANTS
    });
  }
}
