import React, {Component, PropTypes} from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionCreators from '../actions'
import * as DeckUtils from '../utils/deck-utils'
import DeckDropContainer from '../components/deck/deck-drop-container'

function mapStateToProps(state) {
  return { servants: state.servants }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) }
}

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
    this.props.actions.fetchServants()
  }
  render() {
    const {servants} = this.props
    const {cards, filter} = this.state
    return (
      <DeckDropContainer servants={servants} cards={cards} filter={filter}
                         handleCardChange={this.handleCardChange.bind(this)}
                         handleFilterChange={this.handleFilterChange.bind(this)}
                         onDrop={(item) => this.onDrop(null, item)} />
    )
  }
}
