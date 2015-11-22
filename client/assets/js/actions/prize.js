import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';
import fetch from 'whatwg-fetch';

export default class PrizeAction {
  static fetch() {
    return fetch('/api/prizes/')
      .then((response) => {
        return response.json();
      }).then((json) => {
        PrizeAction._receive(json);
      }).catch((error) => {
        console.error(error);
      });
  }
  static _receive(prizes) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.FETCH_PRIZES,
      prizes: prizes
    });
  }
}
