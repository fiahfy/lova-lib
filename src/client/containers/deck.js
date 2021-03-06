import React, {Component, PropTypes} from 'react'
import {DragDropContext} from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {asyncConnect} from 'redux-async-connect'
import * as ActionCreators from '../actions'
import * as DeckUtils from '../utils/deck-utils'
import DeckDropContainer from '../components/deck/deck-drop-container'
import CardPreview from '../components/deck/card-preview'

function mapStateToProps(state) {
  return {servants: state.servants}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch}}) => {
    return ActionCreators.fetchServants()(dispatch)
  }
}])
@DragDropContext(TouchBackend({enableMouseEvents: true}))
@connect(mapStateToProps, mapDispatchToProps)
export default class Deck extends Component {
  static propTypes = {
    servants: PropTypes.arrayOf(PropTypes.object),
    actions:  PropTypes.object
  };
  state = {
    cards:  [],
    filter: {}
  };
  constructor(props) {
    super(props)
    this.state.cards = this.getInitialCards()
  }
  onDrop(droppedIndex, {index, card}) {
    this.handleCardChange(droppedIndex, index, card)
  }
  handleCardChange(droppedIndex, draggedIndex, draggedCard) {
    let {cards} = this.state
    cards[draggedIndex] = droppedIndex ? cards[droppedIndex] : null
    cards[droppedIndex] = draggedCard

    this.setState({
      cards: cards
    })
  }
  handleFilterChange(filter) {
    this.setState({
      filter: filter
    })
  }
  getInitialCards() {
    const {servants, params} = this.props
    return DeckUtils.getCardIds(params.hash).map(id => {
      return _.first(_.filter(servants, {id: id})) || null
    })
  }
  getDeckURL() {
    const {cards} = this.state
    return DeckUtils.getURL(cards.map(card => card ? card.id : 0))
  }
  updateLazyImages() {
    setTimeout(() => {
      // TODO: dont use jquery
      $('.lazy').lazyload()
    }, 1)
  }
  componentDidUpdate() {
    this.updateLazyImages()
  }
  componentDidMount() {
    this.updateLazyImages()
  }
  render() {
    const {servants} = this.props
    const {cards, filter} = this.state
    return (
      <div>
        <DeckDropContainer servants={servants} cards={cards} filter={filter}
                           deckURL={this.getDeckURL()}
                           handleCardChange={::this.handleCardChange}
                           handleFilterChange={::this.handleFilterChange}
                           onDrop={(item) => this.onDrop(null, item)} />
        <CardPreview />
      </div>
    )
  }
}
