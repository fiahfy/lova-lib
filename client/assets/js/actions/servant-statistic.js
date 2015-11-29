import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

export default class ServantStatisticAction {
  static fetchServantStatistics(args) {
    args = args || {};
    args.actionType = AppConstants.ActionTypes.FETCH_SERVANT_STATISTICS;
    AppDispatcher.dispatch(args);
  }
}
