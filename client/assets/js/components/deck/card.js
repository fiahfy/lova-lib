import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';

class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging:        PropTypes.bool.isRequired,
    index:             PropTypes.number,
    card:              PropTypes.object
  };
  static defaultProps = {
    index: null,
    card:  null
  };

  render() {
    const {connectDragSource, card} = this.props;

    const deckImage = card ? `${card.id}.jpg` : 'blank.png';

    return connectDragSource(
      <div className="content">
        <img data-original={`/assets/img/m/${deckImage}`}
             src="/assets/img/m/blank.png"
             className="img-rounded img-responsive lazy" />
        <span>
          {card ? `Cost ${card.cost}` : ''}
        </span>
      </div>,
      'copy'
    )
  }
}
export default DragSource('card', {
  beginDrag(props) {
    return {
      index: props.index,
      card:  props.card
    };
  }
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging:        monitor.isDragging()
}))(Card);
