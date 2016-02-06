import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'
import SkillItem from '../servant-detail/skill-item'

const spec = {
  beginDrag(props) {
    return {
      index: props.index,
      card:  props.card
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging:        monitor.isDragging()
  }
}

@DragSource('card', spec, collect)
export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging:        PropTypes.bool.isRequired,
    index:             PropTypes.number,
    isLazy:            PropTypes.bool,
    card:              PropTypes.object
  };
  static defaultProps = {
    index: null,
    card:  null,
    lazy:  true
  };
  setupPopover() {
    const {card} = this.props
    // TODO: dont use jquery
    $(this.refs.cardSpan).popover('destroy')
    $(this.refs.cardSpan).popover({
      animation: true,
      html: true,
      placement: () => {
        const top = $(this.refs.cardSpan).offset().top
        if (top - $(window).scrollTop() < $(window).height() / 2) {
          return 'bottom'
        }
        return 'top'
      },
      container: 'body',
      trigger: 'hover',
      title: card ? card.name : '',
      content: () => {
        return $(this.refs.cardPopup).html()
      }
    })
  }
  shouldComponentUpdate(nextProps) {
    return (this.props.card || {}).id !== (nextProps.card || {}).id
  }
  componentDidUpdate() {
    this.setupPopover()
  }
  componentDidMount() {
    this.setupPopover()
  }
  render() {
    const {connectDragSource, card, isLazy} = this.props

    const dataOriginal = card
      ? `/assets/storage/img/m/${card.id}.jpg` : '/assets/img/card-blank.png'
    const src = !isLazy && card
      ? `/assets/storage/img/m/${card.id}.jpg` : '/assets/img/card-blank.png'

    return connectDragSource(
      <div className="content">
        <img data-original={dataOriginal}
             src={src}
             className="img-rounded img-responsive lazy" />
        <span ref="cardSpan">
          {card ? `Cost ${card.cost}` : ''}
        </span>
        <div ref="cardPopup" className="skill-popover-content">
          <CardPopup card={card} />
        </div>
      </div>,
      'copy'
    )
  }
}

class CardPopup extends Component {
  static propTypes = {
    card: PropTypes.object
  };
  static defaultProps = {
    card: null
  };
  render() {
    const {card} = this.props

    const createSkillNode = (type) => {
      const skill = card ? card.skill[type] : {}
      return (
        <SkillItem key={type} type={type} {...skill} />
      )
    }

    return (
      <div className="skill-popover">
        <dl className="col-sm-6">
          <dt><b>Active Skill</b></dt>
          {createSkillNode('active')}
        </dl>
        <dl className="col-sm-6">
          <dt><b>Passive Skill</b></dt>
          {createSkillNode('passive')}
        </dl>
      </div>
    )
  }
}
