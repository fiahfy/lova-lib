import classNames from 'classnames'
import React, {Component, PropTypes} from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {asyncConnect} from 'redux-async-connect'
import * as ActionCreators from '../actions'
import DetailSection from '../components/servant-detail/detail-section'
import StatisticsSection from '../components/servant-detail/statistics-section'

function mapStateToProps(state, {params}) {
  const {servants, servantStatistics} = state
  const {id} = params
  return {
    servant:    _.first(_.filter(servants, {id: +id})) || {},
    statistics: _.filter(servantStatistics, {servant_id: +id})
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@asyncConnect([{
  deferred: true,
  promise: ({params, store: {dispatch}}) => {
    const {id} = params
    return Promise.all([
      ActionCreators.fetchServant(+id)(dispatch),
      ActionCreators.fetchServantStatistics({
        servant_id: +id,
        period: 'daily',
        map:    'all',
        queue:  'all'
      })(dispatch)
    ])
  }
}])
@connect(mapStateToProps, mapDispatchToProps)
export default class ServantDetail extends Component {
  static propTypes = {
    servant:    PropTypes.object,
    statistics: PropTypes.arrayOf(PropTypes.object),
    actions:    PropTypes.object
  };
  getHelmet() {
    const {servant} = this.props

    const title = `Servant ${servant.tribe_name}-${_.padStart(servant.tribe_code, 3, 0)} ${servant.name}`
    const description = servant.oral_tradition

    return <Helmet title={title}
                   meta={[{name: 'description', content: description}]} />
  }
  handleStatisticsChange(args) {
    const servantId = this.props.params.id
    this.props.actions.fetchServantStatistics({servant_id: +servantId, ...args})
  }
  render() {
    const {servant, statistics, params} = this.props
    const {section} = params

    const helmet = this.getHelmet()

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

    const sectionNode = section === 'statistics'
      ? <StatisticsSection statistics={statistics}
                           handleStatisticsChange={::this.handleStatisticsChange} />
      : <DetailSection servant={servant} />

    return (
      <div className="container" id="servant-detail">
        {helmet}
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
