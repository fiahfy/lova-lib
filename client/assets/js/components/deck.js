import React, {Component} from 'react';
import classNames from 'classnames';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ServantAction from '../actions/servant';
import ServantStore from '../stores/servant';

class Deck extends Component {
  state = {
    deck: null,
    servants: []
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _onChange() {
    this.setState({
      servants: ServantStore.getServants()
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
        <DeckForm />
        <DeckContainer servants={this.state.servants} />
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
  render() {
    const cardNodes = _.range(1, 9).map((card, index) => {
      let servant;
      return (
        <Card key={index} index={index} servant={servant} />
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

class Card extends Component {
  render() {
    let servant;
    const cls = classNames('card', `tribe-`);
    const bgImage = this.props.index <= 5 ? 'deck.png' : 'side-board.png';
    const deckImage = servant ? `${servant.id}.jpg` : 'blank.png';
    const costNode = servant ? (
      <span>
        Cost {servant.cost}
      </span>
    ) : '';

    return (
      <div className={cls}>
        <div className="background">
          <img src={`/assets/img/m/${bgImage}`} className="img-rounded img-responsive" />
        </div>
        <div className="content">
          <img src={`/assets/img/m/${deckImage}`} className="img-rounded img-responsive" />
          {costNode}
        </div>
      </div>
    );
  }
}

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