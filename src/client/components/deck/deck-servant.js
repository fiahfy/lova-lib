import React, {Component, PropTypes} from 'react'
import CardContainer from './card-container'

export default class DeckServant extends Component {
  static propTypes = {
    servants: PropTypes.arrayOf(PropTypes.object),
    cards:    PropTypes.arrayOf(PropTypes.object),
    filter:   PropTypes.object
  };
  filteredServants() {
    let {servants, filter} = this.props

    const name = filter.name
    delete filter.name

    servants = _.filter(servants, filter)
    if (name) {
      servants = _.filter(servants, servant => servant.name.indexOf(name) > -1)
    }
    return servants
  }
  render() {
    const {cards} = this.props

    const servantNodes = this.filteredServants()
      .sort((a, b) => (a.tribe_id * 1000 + a.tribe_code) - (b.tribe_id * 1000 + b.tribe_code))
      .map((servant, index) => {
        const selected = !!_.find(cards, {id: servant.id})
        return (
          <CardContainer key={index} selected={selected} disabled
                         index={null} card={servant} />
        )
      })

    return (
      <div className="container" id="deck-servants">
        <div>
          {servantNodes}
        </div>
      </div>
    )
  }
}
