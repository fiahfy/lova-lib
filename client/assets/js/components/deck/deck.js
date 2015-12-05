import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ServantAction from '../../actions/servant';
import ServantStore from '../../stores/servant';
import DeckDropContainer from './deck-drop-container';

class Deck extends Component {
  state = {
    cards: [],
    servants: []
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _onChange() {
    const cards = _.range(0, 8).map((index) => {
      if (index  == 4) { return null; }
      return _.clone(ServantStore.getServants()[index], true);
    });
    this.setState({
      servants: ServantStore.getServants(),
      cards: cards
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
  componentDidMount() {
    ServantStore.addChangeListener(this._onChange);
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
      <DeckDropContainer {...this.state} handleCardChange={this._handleCardChange.bind(this)} onDrop={(item) => this._onDrop(null, item)} />
    )
  }
}
export default DragDropContext(HTML5Backend)(Deck);
