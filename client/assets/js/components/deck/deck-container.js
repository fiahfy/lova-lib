import React, {Component} from 'react';
import CardContainer from './card-container';
import DeckUtils from '../../utils/deck-utils';

export default class DeckContainer extends Component {
  _onDrop(droppedIndex, {index, card}) {
    this.props.handleCardChange(droppedIndex, index, card);
  }
  _handleTribeClick(tribe_name) {
    const {filter, handleFilterChange} = this.props;
    filter.tribe_name = tribe_name;
    handleFilterChange(filter);
  }
  _handleTypeClick(type) {
    const {filter, handleFilterChange} = this.props;
    filter.type = type;
    handleFilterChange(filter);
  }
  _handleQueryChange() {
    const {filter, handleFilterChange} = this.props;
    filter.name = this.refs.query.value;
    handleFilterChange(filter);
  }
  componentDidMount() {
    // TODO: dont use jquery
    const dummyWrapper = $('<div>');
    const container = $('#deck-container');
    const baseTop = container.offset().top;
    $(window).on('scroll touchmove', () => {
      if ($(window).scrollTop() >= baseTop) {
        let h = container.outerHeight();
        container.addClass('fitted');
        container.after(dummyWrapper.height(h));
        return;
      }
      container.removeClass('fitted');
      dummyWrapper.remove();
    });
  }
  render() {
    const {cards, servants, filter} = this.props;

    const mana = DeckUtils.getMana(cards);
    const bonusMana = DeckUtils.getBonusMana(cards);
    const totalMana = DeckUtils.getTotalMana(cards);

    const cardNodes = _.range(0, 8).map((index) => {
      return (
        <CardContainer key={index} index={index} card={cards[index]}
                       onDrop={(item) => this._onDrop(index, item)} />
      );
    });

    const tribeIdOptionNodes = _.uniq(servants, (value, key) => {
      return value.tribe_name;
    }).map((servant, index) => {
      return (
        <li key={index}>
          <a onClick={this._handleTribeClick.bind(this, servant.tribe_name)}>{servant.tribe_name}</a>
        </li>
      );
    });

    const typeOptionNodes = _.uniq(servants, (value, key) => {
      return value.type;
    }).map((servant, index) => {
      return (
        <li key={index}>
          <a onClick={this._handleTypeClick.bind(this, servant.type)}>{servant.type}</a>
        </li>
      );
    });

    return (
      <div id="deck-container">
        <div className="container">
          <dl className="row col-xs-6 col-sm-2">
            <dt className="">Mana</dt>
            <dd className="">{mana}<span>{bonusMana ? ` + ${bonusMana}` : ``}</span></dd>
          </dl>
          <dl className="row col-xs-6 col-sm-10">
            <dt className="">Total Mana</dt>
            <dd className="">{totalMana}</dd>
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
                {filter.tribe_name ? filter.tribe_name : `Select Tribe...`} <span className="caret" />
              </button>
              <ul className="dropdown-menu">
                {tribeIdOptionNodes}
              </ul>
            </div>
            <div className="btn-group">
              <button type="button" className="btn btn-primary dropdown-toggle"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {filter.type ? filter.type : `Select Type...`} <span className="caret" />
              </button>
              <ul className="dropdown-menu">
                {typeOptionNodes}
              </ul>
            </div>
          </div>
          <input type="text" placeholder="Input Keyword..." ref="query"
                 className="form-control" onChange={this._handleQueryChange.bind(this)} />
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
