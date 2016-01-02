import React, {Component, PropTypes} from 'react'
import {DragLayer} from 'react-dnd'
import CardContainer from './card-container'

function collect (monitor) {
    var item = monitor.getItem()
    return {
        index: item && item.index,
        card: item && item.card,
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    }
}

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

@DragLayer(collect)
export default class CardPreview extends Component {
  static propTypes = {
    index:         PropTypes.number,
    card:          PropTypes.object,
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging:    PropTypes.bool.isRequired
  }
  getItemStyles () {
    const {currentOffset} = this.props

    if (!currentOffset) {
      return {
          display: 'none'
      }
    }

    let left = 0
    if (this.refs.wrapper) {
      left = this.refs.wrapper.offsetLeft
    }

    const x = currentOffset.x - left
    const y = currentOffset.y
    const transform = `translate(${x}px, ${y}px)`

    return {
      display: 'block',
      pointerEvents: 'none',
      transform: transform,
      WebkitTransform: transform
    }
  }
  render() {
    const {card, isDragging} = this.props

    if (!isDragging) {
      return null
    }

    return (
      <div style={layerStyles}>
        <div className="container">
          <div ref="wrapper" style={this.getItemStyles()}>
            <CardContainer key={null} disabled
                           index={null} isLazy={false} card={card} />
          </div>
        </div>
      </div>
    )
  }
}
