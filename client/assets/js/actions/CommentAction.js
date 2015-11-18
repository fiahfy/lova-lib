import AppConstants from '../AppConstants';
import AppDispatcher from '../AppDispatcher';
import CommentAPIUtils from '../utils/CommentAPIUtils';

export default class CommentAction {
  static create(author, text) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.CREATE,
      author: author,
      text: text
    });
    CommentAPIUtils.create(author, text);
  }
  static load() {
    CommentAPIUtils.getAll();
  }
  static loaded(comments) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.LOADED,
      comments: comments
    });
  }
}
