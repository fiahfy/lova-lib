import React, {Component} from 'react';
import ReactZeroClipboard from 'react-zeroclipboard';
import DeckUtils from '../../utils/deck-utils';

export default class DeckForm extends Component {
  _getDeckURL() {
    let a = window.document.createElement('a');
    a.href = window.location.href;
    return a.protocol + '//'
      + a.hostname + (a.port ? ':' + a.port : a.port)
      + '/deck/' + DeckUtils.getHash(this.props.cards) + '/';
  }
  _onAfterCopy() {
    // TODO: dont use jquery
    const button = $('.copy-clipboard');
    button
      .tooltip('show');
    setTimeout(() => {
      button
        .tooltip('hide');
    }, 1000);
  }
  componentDidMount() {
    // TODO: dont use jquery
    const button = $('.copy-clipboard');
    button
      .tooltip({
        container: 'body',
        title: 'Copied',
        placement: 'bottom',
        trigger: 'manual'
      });
  }
  render() {
    const url = this._getDeckURL();

    return (
      <div className="container" id="deck">
        <div className="page-header">
          <h2>Deck</h2>
        </div>

        <div className="input-group">
          <input type="text" className="form-control" value={url} readOnly />
          <span className="input-group-btn">
            <a href={url} className="visible-xs btn btn-primary" onclick="return false;">Hold to Copy</a>
            <ReactZeroClipboard text={url} onAfterCopy={this._onAfterCopy.bind(this)}>
              <button className="hidden-xs btn btn-primary copy-clipboard">Copy</button>
            </ReactZeroClipboard>
          </span>
        </div>
      </div>
    );
  }
}
