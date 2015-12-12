import classNames from 'classnames'
import React, {Component, PropTypes} from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as ActionCreators from '../actions'
import DetailSection from '../components/servant-detail/detail-section'
import StatisticsSection from '../components/servant-detail/statistics-section'

function mapStateToProps(state) {
  const {servants, servantStatistics, router} = state
  const {id} = router.params
  return {
    servant:    _.first(_.filter(servants, {id: +id})) || {},
    statistics: _.filter(servantStatistics, {servant_id: +id})
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ServantDetail extends Component {
  static propTypes = {
    servant:    PropTypes.object,
    statistics: PropTypes.arrayOf(PropTypes.object),
    actions:    PropTypes.object
  }
  state = {
    section: null
  }
  _getMetaInfo() {
    const {servant} = this.props
    const title = `Servant ${servant.tribe_name}-${_.padLeft(servant.tribe_code, 3, 0)} ${servant.name} : LoVATool`
    const description = servant.oral_tradition
    return {title, description}
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname === nextProps.location.pathname) {
      return
    }
    const {section} = nextProps.params
    this.setState({section})
    const {id} = nextProps.params
    this.props.actions.fetchServant(+id)
    this.props.actions.fetchServantStatistics({servant_id: +id})
  }
  componentWillMount() {
    const {section} = this.props.params
    this.setState({section})
  }
  componentDidMount() {
    const {id} = this.props.params
    this.props.actions.fetchServant(+id)
    this.props.actions.fetchServantStatistics({servant_id: +id})
  }
  render() {
    const {section} = this.state
    const {servant, statistics} = this.props

    const {title, description} = this._getMetaInfo()

    const navigationNodes = ['detail', 'statistics'].map((navigation, index) => {
      const cls = classNames({active: (section || 'detail') === navigation})
      const url = `/servants/${servant.id}/`
                + (navigation === 'statistics' ? 'statistics/' : '')
      return (
        <li key={index} role="presentation" className={cls}>
          <Link to={url}>
            {_.capitalize(navigation)}
          </Link>
        </li>
      )
    })

    const sectionNode = section !== 'statistics'
      ? (<DetailSection servant={servant} />)
      : (<StatisticsSection statistics={statistics} />)

    return (
      <div className="container" id="servant-detail">
        <Helmet title={title}
                meta={[{name: 'description', content: description}]} />
        <div className="page-header">
          <h2>{servant.name}
            <small className="pull-right">
              <a href={`http://wiki.4gamer.net/lova/使い魔/${servant.tribe_name}/${servant.name}/`}>
                Official Servant Page
              </a>
            </small>
          </h2>
        </div>

        <ul className="nav nav-pills nav-justified">
          {navigationNodes}
        </ul>

        {sectionNode}
      </div>
    )
  }
}
