import React, {Component, PropTypes} from 'react'
import {DropTarget} from 'react-dnd'
import DeckForm from './deck-form'
import DeckContainer from './deck-container'
import DeckServant from './deck-servant'

const spec = {
  drop(props, monitor) {
    const hasDroppedOnChild = monitor.didDrop()
    if (hasDroppedOnChild) {
      return
    }
    props.onDrop(monitor.getItem())
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver:            monitor.isOver(),
    canDrop:           monitor.canDrop()
  }
}

@DropTarget('card', spec, collect)
export default class DeckDropContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver:            PropTypes.bool.isRequired,
    canDrop:           PropTypes.bool.isRequired,
    onDrop:            PropTypes.func,
    handleCardChange:  PropTypes.func,
    servants:          PropTypes.arrayOf(PropTypes.object),
    cards:             PropTypes.arrayOf(PropTypes.object),
    filter:            PropTypes.object,
    deckURL:           PropTypes.string
  }
  render() {
    const {connectDropTarget, handleCardChange, handleFilterChange,
      servants, cards, filter, deckURL} = this.props

    return connectDropTarget(
      <div>
        <DeckForm deckURL={deckURL} />
        <DeckContainer cards={cards} servants={servants} filter={filter}
                       handleCardChange={handleCardChange}
                       handleFilterChange={handleFilterChange} />
        <DeckServant servants={servants} cards={cards} filter={filter} />
      </div>
    )
  }
}
