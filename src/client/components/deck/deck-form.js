import React, {Component, PropTypes} from 'react'
import ReactZeroClipboard from 'react-zeroclipboard'

export default class DeckForm extends Component {
  static propTypes = {
    deckURL: PropTypes.string
  };
  onAfterCopy() {
    // TODO: dont use jquery
    const button = $('.copy-clipboard')
    button
      .tooltip('show')
    setTimeout(() => {
      button
        .tooltip('hide')
    }, 1000)
  }
  componentDidMount() {
    // TODO: dont use jquery
    const button = $('.copy-clipboard')
    button
      .tooltip({
        container: 'body',
        title: 'Copied',
        placement: 'bottom',
        trigger: 'manual'
      })
  }
  render() {
    const {deckURL} = this.props

    return (
      <div className="container" id="deck">
        <div className="page-header">
          <h2>Deck</h2>
        </div>

        <div className="input-group">
          <input type="text" className="form-control" value={deckURL} readOnly />
          <span className="input-group-btn">
            <a href={deckURL} className="visible-xs btn btn-primary"
               onclick="return false">Hold to Copy</a>
            <ReactZeroClipboard text={deckURL}
                                onAfterCopy={::this.onAfterCopy}>
              <button className="hidden-xs btn btn-primary copy-clipboard">Copy</button>
            </ReactZeroClipboard>
          </span>
        </div>
      </div>
    )
  }
}
