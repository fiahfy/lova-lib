import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'
import * as ActionCreators from '../actions'
import connectData from '../decorators/connect-data'
import * as ServantUtils from '../utils/servant-utils'
import ServantList from '../components/servant/servant-list'

function fetchDataDeferred(getState, dispatch) {
  return ActionCreators.fetchServants()(dispatch)
}

function mapStateToProps(state) {
  return {servants: state.servants}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@connectData(null, fetchDataDeferred)
@connect(mapStateToProps, mapDispatchToProps)
export default class Servant extends Component {
  static propTypes = {
    servants: PropTypes.arrayOf(PropTypes.object),
    actions:  PropTypes.object
  };
  state = {
    q:       '',
    tribeId: 0
  };
  constructor(props) {
    super(props)
    const {tribe_id: tribeId = 0, q} = props.location.query
    this.state = {tribeId: +tribeId, q}
  }
  handleQueryChange(e) {
    $(this.refs.servantList.getServantsTable()).trigger('sortReset')
    this.setState({q: e.target.value})
  }
  handleQueryClear() {
    const {query} = this.props.location
    query.q = ''
    this.props.history.pushState(null, '/servants/', query)
  }
  handleQuerySubmit(e) {
    e.preventDefault()
    const {query} = this.props.location
    query.q = this.refs.q.value
    this.props.history.pushState(null, '/servants/', query)
  }
  getServantFilter() {
    const {tribe_id: tribeId, q} = this.props.location.query

    let i = 0
    let map = new Map()
    let filter = (q || '').replace(/"[^"]*"/g, (match) => {
      map.set(i, match.replace(/^"(.*)"$/, '$1'))
      return `@${i++}@`
    }).split(/\s+/i).map((element) => {
      return element.replace(/@(\d+)@/, (match, i) => {
        return map.get(+i)
      })
    }).reduce((p, c) => {
      const [key, value] = c.split(':')
      if (!value) {
        p['name'] = key
        return p
      }
      p[_.snakeCase(key)] = isNaN(value) ? value : +value
      return p
    }, {})

    if (tribeId > 0) {
      filter['tribe_id'] = +tribeId
    }

    return filter
  }
  getClearButton() {
    const {q} = this.props.location.query
    if (!q) {
      return null
    }
    return (
      <span className="glyphicon glyphicon-remove form-control-feedback"
            onClick={::this.handleQueryClear}></span>
    )
  }
  setupTableSorter() {
    $(this.refs.servantList.getServantsTable()).trigger('destroy')
    $(this.refs.servantList.getServantsTable()).tablesorter({
      sortRestart: true,
      textSorter: {
        2: (a, b) => {
          return ServantUtils.compareTribeString(a, b)
        }
      },
      headers: {
        1: {
          sorter: false
        },
        6: {
          sortInitialOrder: 'desc'
        },
        7: {
          sortInitialOrder: 'desc'
        },
        8: {
          sortInitialOrder: 'desc'
        },
        9: {
          sortInitialOrder: 'desc'
        }
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    $(this.refs.servantList.getServantsTable()).trigger('sortReset')
    const {tribe_id: tribeId = 0, q} = nextProps.location.query
    this.setState({tribeId: +tribeId, q})
  }
  componentDidUpdate() {
    this.setupTableSorter()
  }
  componentDidMount() {
    this.setupTableSorter()
  }
  render() {
    const {servants} = this.props
    const {tribeId, q} = this.state

    const filter = this.getServantFilter()

    const clearButton = this.getClearButton()

    let currentTribeName = ''
    const tribeIdOptionNodes = [{tribe_id: 0, tribe_name: 'Select Tribe...'}]
      .concat(_.uniq(servants, value => value.tribe_name))
      .map((servant, index) => {
        if (servant.tribe_id === tribeId) {
          currentTribeName = servant.tribe_name
        }
        return (
          <li key={index}>
            <Link to="/servants/" query={{tribe_id: servant.tribe_id, q}}>
              {servant.tribe_name}
            </Link>
          </li>
        )
      })

    return (
      <div className="container" id="servant">
        <div className="page-header">
          <h2>Servants</h2>
        </div>

        <form className="form-group" onSubmit={::this.handleQuerySubmit}>
          <div className="input-group">
            <div className="input-group-btn">
              <div className="btn-group">
                <button type="button" className="btn btn-primary dropdown-toggle"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {currentTribeName} <span className="caret" />
                </button>
                <ul className="dropdown-menu">
                  {tribeIdOptionNodes}
                </ul>
              </div>
            </div>
            <input type="text" className="form-control" placeholder="Input Keyword..."
                   ref="q" value={q} onChange={::this.handleQueryChange} />
          </div>
          {clearButton}
        </form>

        <div>
          <ServantList servants={servants} filter={filter} ref="servantList" />
        </div>
      </div>
    )
  }
}
