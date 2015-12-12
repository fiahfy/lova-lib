import React, {Component} from 'react';
import classNames from 'classnames';
import CardContainer from './card-container';

export default class DeckServant extends Component {
  render() {
    const {servants, filter} = this.props;

    const servantNodes = _.filter(servants, filter).sort((a, b) => {
      return (a.tribe_id * 1000 + a.tribe_code) - (b.tribe_id * 1000 + b.tribe_code);
    }).map((servant, index) => {
      const cls = classNames('card', `tribe-${servant.tribe_id}`, {setted: false});
      return (
        <CardContainer key={index} index={null} card={servant} disabled />
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
