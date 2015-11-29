import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

export default class ServantStatisticAction {
  static fetchServantStatistics(args) {
    let params = args || {};
    params.actionType = AppConstants.ActionTypes.FETCH_SERVANT_STATISTICS;
    AppDispatcher.dispatch(params);
  }
}
