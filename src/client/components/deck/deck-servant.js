import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'
import CardContainer from './card-container'

export default class DeckServant extends Component {
  static propTypes = {
    servants: PropTypes.arrayOf(PropTypes.object)
  }
  _filteredServants() {
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
    const servantNodes = this._filteredServants()
      .sort((a, b) => (a.tribe_id * 1000 + a.tribe_code) - (b.tribe_id * 1000 + b.tribe_code))
      .map((servant, index) => {
        const cls = classNames('card', `tribe-${servant.tribe_id}`, {setted: false})
        return (
          <CardContainer key={index} index={null} card={servant} disabled />
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
