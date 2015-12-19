import React, {Component, PropTypes} from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionCreators from '../actions'
import * as DeckUtils from '../utils/deck-utils'
import DeckDropContainer from '../components/deck/deck-drop-container'
import connectData from '../decorators/connect-data'

function fetchDataDeferred(getState, dispatch, location, params) {
  return ActionCreators.fetchServants()(dispatch)
}

function mapStateToProps(state) {
  return { servants: state.servants }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) }
}

@connectData(null, fetchDataDeferred)
@DragDropContext(HTML5Backend)
@connect(mapStateToProps, mapDispatchToProps)
export default class Deck extends Component {
  static propTypes = {
    servants: PropTypes.arrayOf(PropTypes.object),
    actions:  PropTypes.object
  }
  state = {
    cards:  [],
    filter: {}
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
  getDeckURL() {
    const {cards} = this.state
    const {location} = this.props

    return DeckUtils.getURL(cards.map(card => card ? card.id : 0))
  }
  componentWillReceiveProps(nextProps) {
    const {servants, params} = nextProps
    const {hash} = nextProps.params
    const cards = DeckUtils.getCardIds(hash).map(id => {
      return _.first(_.filter(servants, {id: id})) || null
    })
    this.setState({cards})
  }
  componentDidUpdate() {
    setTimeout(() => {
      // TODO: dont use jquery
      $('.lazy').lazyload()
    }, 1)
  }
  componentDidMount() {
    setTimeout(() => {
      // TODO: dont use jquery
      $('.lazy').lazyload()
    }, 1)
  }
  render() {
    const {servants} = this.props
    const {cards, filter} = this.state
    return (
      <DeckDropContainer servants={servants} cards={cards} filter={filter}
                         deckURL={this.getDeckURL()}
                         handleCardChange={this.handleCardChange.bind(this)}
                         handleFilterChange={this.handleFilterChange.bind(this)}
                         onDrop={(item) => this.onDrop(null, item)} />
    )
  }
}
