import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {DragDropContext, DropTarget, DragSource} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ServantAction from '../actions/servant';
import ServantStore from '../stores/servant';

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
  componentDidMount() {
    ServantStore.addChangeListener(this._onChange);
    ServantAction.fetchServants();
  }
  componentWillUnmount() {
    ServantStore.removeChangeListener(this._onChange);
  }
  render() {
    return (
      <div>
        <DeckForm cards={this.state.cards} />
        <DeckContainer cards={this.state.cards} servants={this.state.servants} />
        <DeckServant servants={this.state.servants} />
      </div>
    );
  }
}
export default DragDropContext(HTML5Backend)(Deck);

class DeckForm extends Component {
  render() {
    return (
      <div className="container" id="deck">
        <div className="page-header">
          <h2>Deck</h2>
        </div>

        <div className="input-group">
          <input type="text" className="form-control" placeholder="" />
          <span className="input-group-btn">
            <a href="" className="visible-xs btn btn-primary" onclick="return false;">Hold to Copy</a>
            <button className="hidden-xs btn btn-primary copy-clipboard"
                    data-toggle="tooltip" data-placement="bottom"
                    data-clipboard-text="">Copy</button>
          </span>
        </div>
      </div>
    );
  }
}

class DeckContainer extends Component {
  _onDrop(item) {
    console.log(item);
  }
  render() {
    const cardNodes = _.range(0, 8).map((index) => {
      return (
        <CardContainer key={index} index={index} card={this.props.cards[index]}
                       onDrop={this._onDrop.bind(this)} />
      );
    });

    const tribeIdOptionNodes = _.uniq(this.props.servants, (value, key) => {
      return value.tribe_id;
    }).map((servant, index) => {
      return (
        <li key={index}>
          <a>{servant.tribe_name}</a>
        </li>
      );
    });

    const typeOptionNodes = _.uniq(this.props.servants, (value, key) => {
      return value.type;
    }).map((servant, index) => {
      return (
        <li key={index}>
          <a>{servant.type}</a>
        </li>
      );
    });

    const tribeName = '';
    const type = '';

    return (
      <div id="deck-container">
        <div className="container">
          <dl className="row col-xs-6 col-sm-2">
            <dt className="">Mana</dt>
            <dd className="">10<span> + 10</span></dd>
          </dl>
          <dl className="row col-xs-6 col-sm-10">
            <dt className="">Total Mana</dt>
            <dd className="">10</dd>
          </dl>
        </div>

        <div className="container hidden-xs">
          {cardNodes}
        </div>

        <div className="container input-group hidden-xs">
          <div className="input-group-btn">
            <div className="btn-group">
              <button type="button" className="btn btn-primary dropdown-toggle"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {tribeName} <span className="caret" />
              </button>
              <ul className="dropdown-menu">
                {tribeIdOptionNodes}
              </ul>
            </div>
            <div className="btn-group">
              <button type="button" className="btn btn-primary dropdown-toggle"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {type} <span className="caret" />
              </button>
              <ul className="dropdown-menu">
                {typeOptionNodes}
              </ul>
            </div>
          </div>
          <input type="text" value="" placeholder="Input Keyword..." className="form-control" />
        </div>

        {/*
        <div className="container visible-xs">
          <div className="card"
               ng-repeat="($index, servant) in c.deck.servants track by $index"
               ng-if="[0, 1, 2, 6].indexOf($index) > -1"
               ng-className="'tribe-' + servant.tribeId"
               ng-drop="true" ng-drop-success="c.setServant($index, $data)">
            <div className="background">
              <img ng-if="[0, 1, 2].indexOf($index) > -1" src="/assets/img/m/deck.png" className="img-rounded img-responsive" />
              <img ng-if="[6].indexOf($index) > -1" src="/assets/img/m/side-board.png" className="img-rounded img-responsive" />
            </div>
            <div className="content"
                 ng-drag="servant" ng-drag-data="{index: $index, servant: servant}" ng-drag-stop="c.clearServant($index)"
                 ng-dblclick="c.openServant(servant.id)">
              <img ng-src="/assets/img/m/{{ servant ? servant.id + '.jpg' : 'blank.png' }}" className="img-rounded img-responsive" />
        <span ng-if="servant"
              lova-skill-popover="{card: '.card', title: servant.name, content: '.skill-popover-content', container: '#deck-popover-container'}">
          Cost {{ servant.cost }}
        </span>
            </div>
            <lova-skill-popover-content servant="servant"></lova-skill-popover-content>
          </div>
          <div className="card"
               ng-repeat="($index, servant) in c.deck.servants track by $index"
               ng-if="[3, 4, 5, 7].indexOf($index) > -1"
               ng-className="'tribe-' + servant.tribeId"
               ng-drop="true" ng-drop-success="c.setServant($index, $data)">
            <div className="background">
              <img ng-if="[3, 4, 5].indexOf($index) > -1" src="/assets/img/m/deck.png" className="img-rounded img-responsive" />
              <img ng-if="[7].indexOf($index) > -1" src="/assets/img/m/side-board.png" className="img-rounded img-responsive" />
            </div>
            <div className="content"
                 ng-drag="servant" ng-drag-data="{index: $index, servant: servant}" ng-drag-stop="c.clearServant($index)"
                 ng-dblclick="c.openServant(servant.id)">
              <img ng-src="/assets/img/m/{{ servant ? servant.id + '.jpg' : 'blank.png' }}" className="img-rounded img-responsive" />
        <span ng-if="servant"
              lova-skill-popover="{card: '.card', title: servant.name, content: '.skill-popover-content', container: '#deck-popover-container'}">
          Cost {{ servant.cost }}
        </span>
            </div>
            <lova-skill-popover-content servant="servant"></lova-skill-popover-content>
          </div>
        </div>
        */}
      </div>
    );
  }
}

class _CardContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    onDrop: PropTypes.func.isRequired
  };

  render() {
    const {connectDropTarget, isOver, canDrop} = this.props;
    const isActive = isOver && canDrop;

    let backgroundColor = null;
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    const card = this.props.card || {};

    const tribeCls = card.tribe_id ? `tribe-${card.tribe_id}` : null;
    const cls = classNames('card', tribeCls);
    const bgImage = this.props.index <= 5 ? 'deck.png' : 'side-board.png';

    return connectDropTarget(
      <div className={cls}>
        <div className="background">
          <img src={`/assets/img/m/${bgImage}`} className="img-rounded img-responsive" style={{backgroundColor: backgroundColor}} />
        </div>
        <Card card={card} />
      </div>
    );
  }
}
const CardContainer = DropTarget('card', {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  }
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(_CardContainer);

class _Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    card: PropTypes.object
  };

  render() {
    const {connectDragSource, isDragging} = this.props;
    const opacity = isDragging ? 0.4 : 1;

    const card = this.props.card || {};

    const deckImage = card.id ? `${card.id}.jpg` : 'blank.png';

    return connectDragSource(
      <div className="content">
        <img src={`/assets/img/m/${deckImage}`} className="img-rounded img-responsive" />
        <span>
          {card.cost ? `Cost ${card.cost}` : ''}
        </span>
      </div>
    )
  }
}
const Card = DragSource('card', {
  beginDrag(props) {
    return {
      card: props.card
    };
  }
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(_Card);

class DeckServant extends Component {
  componentDidUpdate() {
    setTimeout(() => {
      // TODO: dont use jquery
      $('.lazy').lazyload();
    }, 1);
  }
  render() {
    const servantNodes = this.props.servants.sort((a, b) => {
      return (a.tribe_id * 1000 + a.tribe_code) - (b.tribe_id * 1000 + b.tribe_code);
    }).map((servant, index) => {
      const cls = classNames('card', `tribe-${servant.tribe_id}`, {setted: false});
      return (
        <div key={index} className={cls}>
          <div className="background">
            <img src="/assets/img/m/blank.png" className="img-rounded img-responsive" />
          </div>
          <div className="content">
            <img data-original={`/assets/img/m/${servant.id}.jpg`}
                 src="/assets/img/m/blank.png" className="img-rounded img-responsive lazy" />
            <span>
              Cost {servant.cost}
            </span>
          </div>
        </div>
      );
    });

    return (
      <div className="container" id="deck-servants">
        <div>
          {servantNodes}
        </div>
      </div>
    );
  }
}