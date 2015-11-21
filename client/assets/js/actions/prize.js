import AppConstants from '../constants';
import AppDispatcher from '../dispatcher';
import fetch from 'whatwg-fetch';

export default class PrizeAction {
  static fetch() {
    return fetch('/api/prizes/')
      .then((response) => {
        return response.json();
      }).then((json) => {
        PrizeAction.receive(json);
      }).catch((error) => {
        console.error(error);
      });
  }
  static receive(prizes) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.RECEIVE_PRIZES,
      prizes: prizes
    });
  }
}
