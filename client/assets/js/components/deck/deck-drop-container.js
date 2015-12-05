import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import DeckForm from './deck-form';
import DeckContainer from './deck-container';
import DeckServant from './deck-servant';

class DeckDropContainer extends Component {
  render() {
    const {connectDropTarget, isOver, canDrop} = this.props;

    return connectDropTarget(
      <div>
        <DeckForm cards={this.props.cards} />
        <DeckContainer cards={this.props.cards} servants={this.props.servants} handleCardChange={this.props.handleCardChange} />
        <DeckServant servants={this.props.servants} />
      </div>
    );
  }
}
export default DropTarget('card', {
  drop(props, monitor) {
    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild) {
      return;
    }
    props.onDrop(monitor.getItem());
  }
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(DeckDropContainer);
