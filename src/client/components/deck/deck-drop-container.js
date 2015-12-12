import React, {Component, PropTypes} from 'react';
import {DropTarget} from 'react-dnd';
import DeckForm from './deck-form';
import DeckContainer from './deck-container';
import DeckServant from './deck-servant';

class DeckDropContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver:            PropTypes.bool.isRequired,
    canDrop:           PropTypes.bool.isRequired,
    onDrop:            PropTypes.func,
    handleCardChange:  PropTypes.func,
    servants:          PropTypes.array,
    cards:             PropTypes.array,
    filter:            PropTypes.object
  };

  render() {
    const {connectDropTarget, handleCardChange, handleFilterChange,
      servants, cards, filter} = this.props;

    return connectDropTarget(
      <div>
        <DeckForm cards={cards} />
        <DeckContainer cards={cards} servants={servants} filter={filter}
                       handleCardChange={handleCardChange}
                       handleFilterChange={handleFilterChange} />
        <DeckServant servants={servants} filter={filter} />
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
