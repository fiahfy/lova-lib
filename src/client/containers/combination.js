import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {asyncConnect} from 'redux-async-connect'
import {Link} from 'react-router'
import * as ActionCreators from '../actions'
import * as ServantUtils from '../utils/servant-utils'
import CombinationList from '../components/combination/combination-list'

function mapStateToProps(state) {
  return {
    servants:     state.servants,
    combinations: state.combinations
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch}}) => {
    return Promise.all([
      ActionCreators.fetchServants()(dispatch),
      ActionCreators.fetchCombinations()(dispatch)
    ])
  }
}])
@connect(mapStateToProps, mapDispatchToProps)
export default class Combination extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  static propTypes = {
    servants:     PropTypes.arrayOf(PropTypes.object),
    combinations: PropTypes.arrayOf(PropTypes.object),
    actions:      PropTypes.object
  };
  state = {
    tribeId: 0
  };
  constructor(props) {
    super(props)
    const {tribe_id: tribeId = 0} = props.location.query
    this.state = {tribeId: +tribeId}
  }
  handleQueryChange(e) {
    $(this.refs.combinationList.getCombinationsTable()).trigger('sortReset')
    this.setState({q: e.target.value})
  }
  getServantMap() {
    const {servants} = this.props
    return servants.reduce((previous, current) => {
      previous[current.id] = current
      return previous
    }, {})
  }
  getFilter() {
    const {tribe_id: tribeId} = this.props.location.query

    let filter = {}
    if (tribeId > 0) {
      filter['tribe_id'] = +tribeId
    }

    return filter
  }
  setupTableSorter() {
    $(this.refs.combinationList.getCombinationsTable()).trigger('destroy')
    $(this.refs.combinationList.getCombinationsTable()).tablesorter({
      // sortRestart: true,
      // // textSorter: {
      // //   2: (a, b) => {
      // //     return 1//ServantUtils.compareTribeString(a, b)
      // //   }
      // // },
      // headers: {
      //   1: {
      //     sorter: false
      //   },
      //   // 6: {
      //   //   sortInitialOrder: 'desc'
      //   // },
      //   // 7: {
      //   //   sortInitialOrder: 'desc'
      //   // },
      //   // 8: {
      //   //   sortInitialOrder: 'desc'
      //   // },
      //   // 9: {
      //   //   sortInitialOrder: 'desc'
      //   // }
      // }
    })
  }
  componentWillReceiveProps(nextProps) {
    $(this.refs.combinationList.getCombinationsTable()).trigger('sortReset')
    const {tribe_id: tribeId = 0} = nextProps.location.query
    this.setState({tribeId: +tribeId})
  }
  componentDidUpdate() {
    this.setupTableSorter()
  }
  componentDidMount() {
    this.setupTableSorter()
  }
  render() {
    const {combinations} = this.props
    const {tribeId} = this.state

    const filter = this.getFilter()

    // let currentTribeName = ''
    // const tribeIdOptionNodes = [{tribe_id: 0, tribe_name: 'Select Tribe...'}]
    //   .concat(_.uniqBy(combinations, value => value.tribe_name))
    //   .map((combination, index) => {
    //     if (combination.tribe_id === tribeId) {
    //       currentTribeName = combination.tribe_name
    //     }
    //     return (
    //       <li key={index}>
    //         <Link to={{pathname: '/combinations/', query: {tribe_id: combination.tribe_id}}}>
    //           {combination.tribe_name}
    //         </Link>
    //       </li>
    //     )
    //   })
    const servantMap = this.getServantMap()
    const mergedCombinations = combinations.map(combination => {
      combination.servants = combination.servant_ids.map(servantId => {
        return servantMap[servantId]
      })
      return combination
    })

    return (
      <div className="container" id="combination">
        <div className="page-header">
          <h2>Combinations</h2>
        </div>
{/*
        <div className="btn-group">
          <button type="button" className="btn btn-primary dropdown-toggle"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {currentTribeName} <span className="caret" />
          </button>
          <ul className="dropdown-menu">
            {tribeIdOptionNodes}
          </ul>
        </div>
*/}
        <div>
          <CombinationList combinations={combinations} filter={filter} ref="combinationList" />
        </div>
      </div>
    )
  }
}
