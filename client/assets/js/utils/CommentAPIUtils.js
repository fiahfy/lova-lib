import CommentAction from '../actions/CommentAction';

export default class CommentAPIUtils {
  static getAll() {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    CommentAction.loaded(comments);
  }
  static create(author, text) {
    let comment = {
      id: Date.now(),
      author: author,
      text: text
    };
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(comment);
    // delay 2sec
    setTimeout(() => {
      localStorage.setItem('comments', JSON.stringify(comments));
      CommentAction.loaded(comments);
    }, 2000);
  }
}
