import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';

export default class SpellStatisticAction {
  static fetchSpellStatistics(args) {
    let params = args || {};
    params.actionType = AppConstants.ActionTypes.FETCH_SPELL_STATISTICS;
    AppDispatcher.dispatch(params);
  }
}
