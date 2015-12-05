import React, {Component} from 'react';
import DeckUtils from '../../utils/deck-utils';

export default class DeckForm extends Component {
  _getDeckURL() {
    let a = window.document.createElement('a');
    a.href = window.location.href;
    return a.protocol + '//'
      + a.hostname + (a.port ? ':' + a.port : a.port)
      + '/deck/' + DeckUtils.getHash(this.props.cards);
  }
  render() {
    const url = this._getDeckURL();
console.log(url);
    return (
      <div className="container" id="deck">
        <div className="page-header">
          <h2>Deck</h2>
        </div>

        <div className="input-group">
          <input type="text" className="form-control" value={url} readOnly />
          <span className="input-group-btn">
            <a href={url} className="visible-xs btn btn-primary" onclick="return false;">Hold to Copy</a>
            <button className="hidden-xs btn btn-primary copy-clipboard"
                    data-toggle="tooltip" data-placement="bottom"
                    data-clipboard-text={url}>Copy</button>
          </span>
        </div>
      </div>
    );
  }
}
