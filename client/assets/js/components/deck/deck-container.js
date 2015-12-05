import React, {Component} from 'react';
import CardContainer from './card-container';
import DeckUtils from '../../utils/deck-utils';

export default class DeckContainer extends Component {
  _onDrop(droppedIndex, {index, card}) {
    this.props.handleCardChange(droppedIndex, index, card);
  }
  componentDidMount() {
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
    const mana = DeckUtils.getMana(this.props.cards);
    const bonusMana = DeckUtils.getBonusMana(this.props.cards);
    const totalMana = DeckUtils.getTotalMana(this.props.cards);

    const cardNodes = _.range(0, 8).map((index) => {
      return (
        <CardContainer key={index} index={index} card={this.props.cards[index]}
                       onDrop={(item) => this._onDrop(index, item)} />
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
