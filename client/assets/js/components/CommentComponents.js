import React from 'react';
import CommentStore from '../stores/CommentStore';
import CommentAction from '../actions/CommentAction';

export default class CommentBox extends React.Component {
  state = {data: []};
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }
  _onSubmit(comment) {
    CommentAction.create(comment.author, comment.text);
    //this.setState({data: CommentStore.getComments()});
  }
  _onChange() {
    this.setState({data: CommentStore.getAll()});
  }
  componentDidMount() {
    CommentStore.addChangeListener(this._onChange);
    CommentAction.load();
  }
  componentWillUnmount() {
    CommentStore.removeChangeListener(this._onChange);
  }
  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onSubmit={this._onSubmit.bind(this)} />
      </div>
    );
  }
}

class CommentList extends React.Component {
  render() {
    let commentNodes = this.props.data.map((comment) => {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
}

class CommentForm extends React.Component {
  _onSubmit(e) {
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
  }
  render() {
    return (
      <form className="commentForm" onSubmit={this._onSubmit.bind(this)}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
}

class Comment extends React.Component {
  _rawMarkup() {
    let rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return {__html: rawMarkup};
  }
  render() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this._rawMarkup()} />
      </div>
    );
  }
}
