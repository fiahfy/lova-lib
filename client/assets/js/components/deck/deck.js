import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ServantAction from '../../actions/servant';
import ServantStore from '../../stores/servant';
import DeckDropContainer from './deck-drop-container';
import DeckUtils from '../../utils/deck-utils';

class Deck extends Component {
  state = {
    cards: [],
    servants: [],
    filter: {}
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _onChange() {
    this.setState({
      servants: ServantStore.getServants(),
      cards:    DeckUtils.getCards(this.props.params.hash)
    });
  }
  _onDrop(droppedIndex, {index, card}) {
    this._handleCardChange(droppedIndex, index, card);
  }
  _handleCardChange(droppedIndex, draggedIndex, draggedCard) {
    let cards = this.state.cards;
    cards[draggedIndex] = droppedIndex ? cards[droppedIndex] : null;
    cards[droppedIndex] = draggedCard;

    this.setState({
      cards: cards
    });
  }
  _handleFilterChange(filter) {
    this.setState({
      filter: filter
    });
  }
  componentDidMount() {
    ServantStore.addChangeListener(this._onChange);
    ServantAction.fetchServants();
  }
  componentWillReceiveProps() {
    ServantAction.fetchServants();
  }
  componentDidUpdate() {
    setTimeout(() => {
      // TODO: dont use jquery
      $('.lazy').lazyload();
    }, 1);
  }
  componentWillUnmount() {
    ServantStore.removeChangeListener(this._onChange);
  }
  render() {
    return (
      <DeckDropContainer {...this.state} handleCardChange={this._handleCardChange.bind(this)}
                                         handleFilterChange={this._handleFilterChange.bind(this)}
                                         onDrop={(item) => this._onDrop(null, item)} />
    )
  }
}
export default DragDropContext(HTML5Backend)(Deck);
