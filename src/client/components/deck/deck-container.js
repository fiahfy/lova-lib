import React, {Component, PropTypes} from 'react'
import * as DeckUtils from '../../utils/deck-utils'
import CardContainer from './card-container'

export default class DeckContainer extends Component {
  static propTypes = {
    servants: PropTypes.arrayOf(PropTypes.object),
    cards:    PropTypes.arrayOf(PropTypes.object),
    filter:   PropTypes.object
  }
  onDrop(droppedIndex, {index, card}) {
    this.props.handleCardChange(droppedIndex, index, card)
  }
  handleTribeClick(tribe_name) {
    const {filter, handleFilterChange} = this.props
    delete filter.tribe_name
    if (tribe_name) {
      filter.tribe_name = tribe_name
    }
    handleFilterChange(filter)
  }
  handleTypeClick(type) {
    const {filter, handleFilterChange} = this.props
    delete filter.type
    if (type) {
      filter.type = type
    }
    handleFilterChange(filter)
  }
  handleQueryChange() {
    const {filter, handleFilterChange} = this.props
    filter.name = this.refs.query.value
    handleFilterChange(filter)
  }
  componentDidMount() {
    // TODO: dont use jquery
    const dummyWrapper = $('<div>')
    const container = $('#deck-container')
    const baseTop = container.offset().top
    $(window).on('scroll touchmove', () => {
      if ($(window).scrollTop() >= baseTop) {
        let h = container.outerHeight()
        container.addClass('fitted')
        container.after(dummyWrapper.height(h))
        return
      }
      container.removeClass('fitted')
      dummyWrapper.remove()
    })
  }
  render() {
    const {cards, servants, filter} = this.props

    const mana = DeckUtils.getMana(cards)
    const bonusMana = DeckUtils.getBonusMana(cards)
    const totalMana = DeckUtils.getTotalMana(cards)

    const createCardNodes = indexes => {
      return indexes.map((index) => {
        return (
          <CardContainer key={index} index={index} card={cards[index]}
                         onDrop={(item) => this.onDrop(index, item)} />
        )
      })
    }

    const cardNodes = createCardNodes(_.range(0, 8))
    const cardNodesForXS = createCardNodes([0, 1, 2, 6, 3, 4, 5, 7])

    const tribeIdOptionNodes = [{tribe_name: 'Select Tribe...'}]
      .concat(_.uniq(servants, value => value.tribe_name))
      .map((servant, index) => {
        const tribeName = servant.id ? servant.tribe_name : null
        return (
          <li key={index}>
            <a onClick={this.handleTribeClick.bind(this, tribeName)}>{servant.tribe_name}</a>
          </li>
        )
      })

    const typeOptionNodes = [{type: 'Select Type...'}]
      .concat(_.uniq(servants, value => value.type))
      .map((servant, index) => {
        const type = servant.id ? servant.type : null
        return (
          <li key={index}>
            <a onClick={this.handleTypeClick.bind(this, type)}>{servant.type}</a>
          </li>
        )
      })

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
        <div className="container visible-xs">
          {cardNodesForXS}
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
                 className="form-control" onChange={this.handleQueryChange.bind(this)} />
        </div>
      </div>
    )
  }
}
