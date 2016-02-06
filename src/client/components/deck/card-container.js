import classNames from 'classnames'
import React, {Component, PropTypes} from 'react'
import {DropTarget} from 'react-dnd'
import Card from './card'

function types(props) {
  return props.disabled ? '' : 'card'
}

const spec = {
  drop(props, monitor) {
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

@DropTarget(types, spec, collect)
export default class CardContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver:            PropTypes.bool.isRequired,
    canDrop:           PropTypes.bool.isRequired,
    onDrop:            PropTypes.func,
    disabled:          PropTypes.bool,
    selected:          PropTypes.bool,
    isLazy:            PropTypes.bool,
    index:             PropTypes.number,
    card:              PropTypes.object
  };
  static defaultProps = {
    onDrop:   () => {},
    disabled: false,
    selected: false,
    isLazy:   true,
    index:    null,
    card:     null
  };
  render() {
    const {connectDropTarget, selected, isLazy, index, card} = this.props

    const tribeCls = card ? `tribe-${card.tribe_id}` : null
    const cls = classNames('card', tribeCls, {'setted': selected})
    const bgImage = index === null
      ? 'card-blank.png' : index <= 5 ? 'card-deck.png' : 'card-side-board.png'

    return connectDropTarget(
      <div className={cls}>
        <div className="background">
          <img src={`/assets/img/${bgImage}`}
               className="img-rounded img-responsive" />
        </div>
        <Card index={index} isLazy={isLazy} card={card} />
      </div>
    )
  }
}
