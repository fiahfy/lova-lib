import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
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
    this.state = {tribeId, q}
  }
  handleTribeChange(e) {
    $(this.refs.servantList.getServantsTable()).trigger('sortReset')
    const {query} = this.props.location
    query.tribe_id = e.val
    this.props.history.pushState(null, '/servants/', query)
  }
  handleQueryChange(e) {
    this.setState({q: e.target.value})
  }
  handleQuerySubmit(e) {
    e.preventDefault()
    // TODO: not work
    // if sort rows, input text and submit
    $(this.refs.servantList.getServantsTable()).trigger('sortReset')
    const {query} = this.props.location
    query.q = this.refs.q.value
    this.props.history.pushState(null, '/servants/', query)
  }
  getServantFilter() {
    const {tribe_id, q} = this.props.location.query

    let i = 0
    let map = new Map()
    let filter = (q || '').replace(/"[^"]*"/g, (match) => {
      map.set(i, match.replace(/^"(.*)"$/, "$1"))
      return `@${i++}@`
    }).split(/[\s　]/i).map((element) => { // eslint-disable-line no-irregular-whitespace
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

    if (tribe_id > 0) {
      filter['tribe_id'] = +tribe_id
    }

    return filter
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
    const {tribe_id: tribeId = 0, q} = nextProps.location.query
    this.setState({tribeId, q})
    $(this.refs.tribeSelect).select2("destroy")
    $(this.refs.tribeSelect).select2()
  }
  componentDidUpdate() {
    this.setupTableSorter()
  }
  componentDidMount() {
    this.setupTableSorter()
    $(this.refs.tribeSelect).select2().on('select2-selecting', this.handleTribeChange.bind(this))
  }
  render() {
    const {servants} = this.props
    const {tribeId, q} = this.state

    const tribeIdOptionNodes = [
      {value: 0, name: 'Select Tribe...'},
      {value: 1, name: '人獣'},
      {value: 2, name: '神族'},
      {value: 3, name: '魔種'},
      {value: 4, name: '海種'},
      {value: 5, name: '不死'}
    ].map((option, index) => {
      return (
        <option key={index} value={option.value}>
          {option.name}
        </option>
      )
    })

    const filter = this.getServantFilter()

    return (
      <div className="container" id="servant">
        <div className="page-header">
          <h2>Servants</h2>
        </div>

        <div className="clearfix">
          <div className="pull-left">
            <select className="form-control select select-primary select-block mbl"
                    ref="tribeSelect" value={tribeId}
                    onChange={this.handleTribeChange.bind(this)}>
              {tribeIdOptionNodes}
            </select>
          </div>
        </div>

        <div className="form-group">
          <form onSubmit={this.handleQuerySubmit.bind(this)}>
            <input type="text" className="form-control" placeholder="Input Keyword..."
                   ref="q" value={q} onChange={this.handleQueryChange.bind(this)} />
          </form>
        </div>

        <div>
          <ServantList servants={servants} filter={filter} ref="servantList" />
        </div>
      </div>
    )
  }
}
