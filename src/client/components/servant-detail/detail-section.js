import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import StatusItem from './status-item'
import SkillItem from './skill-item'

export default class DetailSection extends Component {
  static propTypes = {
    servant: PropTypes.object
  };
  wrapQuoteIfNeed(value) {
    return value.indexOf(' ') > -1 ? `"${value}"` : value
  }
  oralTraditionHTML() {
    const {oral_tradition = ''} = this.props.servant
    return oral_tradition.replace(/\n/gi, '<br />')
  }
  render() {
    const {servant} = this.props

    const createStatusNodes = rows => {
      return _.map(servant.status, (status, level) => {
        return (
          <StatusItem key={level} rows={rows} level={+level} {...status} />
        )
      })
    }

    const createSkillNode = type => {
      const skill = servant.skill ? servant.skill[type] : {}
      return (
        <SkillItem key={type} type={type} {...skill} />
      )
    }

    return (
      <div className="detail">
        <div className="row">
          <div className="col-lg-4 col-md-5 col-sm-5">
            <div className="col-sm-12 logo">
              <a href={`assets/storage/img/l/${servant.id}.jpg`} target="_self">
                <img src={servant.id ? `assets/storage/img/l/${servant.id}.jpg` : ''}
                     className="center-block img-rounded img-responsive" />
              </a>
            </div>
          </div>
          <div className="col-lg-8 col-md-7 col-sm-7">
            <div className="row">
              <div className="col-sm-6">
                <dl className="row">
                  <dt className="col-xs-3">Tribe</dt>
                  <dd className="col-xs-9">
                    <Link to={{pathname: '/servants/', query: {tribe_id: servant.tribe_id}}}>
                      {servant.tribe_name}
                    </Link>-{_.padStart(servant.tribe_code, 3, 0)}
                  </dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Type</dt>
                  <dd className="col-xs-9">
                    <Link to={{pathname: '/servants/', query: {q: `type:${servant.type}`}}}>
                      {servant.type}
                    </Link>
                  </dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Cost</dt>
                  <dd className="col-xs-9">
                    <Link to={{pathname: '/servants/', query: {q: `cost:${servant.cost}`}}}>
                      {servant.cost}
                    </Link>
                  </dd>
                </dl>
              </div>
              <div className="col-sm-6">
                <dl className="row">
                  <dt className="col-xs-3">Released</dt>
                  <dd className="col-xs-9">
                    {moment(servant.release_date || new Date).format('YYYY-MM-DD')}
                  </dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Updated</dt>
                  <dd className="col-xs-9">
                    {moment(servant.update_date || new Date).format('YYYY-MM-DD')}
                  </dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Range</dt>
                  <dd className="col-xs-9">
                    <Link to={{pathname: '/servants/', query: {q: `range:${servant.range}`}}}>
                      {servant.range}
                    </Link>
                  </dd>
                </dl>
              </div>
            </div>

            <dl className="row">
              <dt className="col-sm-12">Oral Tradition</dt>
              <dd className="col-sm-12">
                <div className="well well-sm">
                  <small dangerouslySetInnerHTML={{__html: this.oralTraditionHTML()}} />
                </div>
              </dd>
            </dl>

            <div className="row">
              <dl className="col-sm-6 row">
                <dt className="col-xs-3">Illust</dt>
                <dd className="col-xs-9">
                  <Link to={{pathname: '/servants/', query: {q: `illustrationBy:${this.wrapQuoteIfNeed(servant.illustration_by || '')}`}}}>
                    {servant.illustration_by}
                  </Link>
                </dd>
              </dl>
              <dl className="col-sm-6 row">
                <dt className="col-xs-3">CV</dt>
                <dd className="col-xs-9">
                  <Link to={{pathname: '/servants/', query: {q: `characterVoice:${this.wrapQuoteIfNeed(servant.character_voice || '')}`}}}>
                    {servant.character_voice}
                  </Link>
                </dd>
              </dl>
            </div>

            <div className="status">
              <dl>
                <dt><b>Status</b></dt>
                <dd className="col-xs-12">
                  <table className="table visible-md visible-lg">
                    <thead>
                    <tr>
                      <th className="">Level</th>
                      <th className="">HP</th>
                      <th className="">AP</th>
                      <th className="">ATK</th>
                      <th className="">POW</th>
                      <th className="">DEF</th>
                      <th className="">RES</th>
                      <th className="">MS</th>
                      <th className="">AS</th>
                    </tr>
                    </thead>
                    {createStatusNodes(1)}
                  </table>
                  <table className="table hidden-md hidden-lg">
                    <thead>
                    <tr>
                      <th rowSpan="2">Level</th>
                      <th className="">HP</th>
                      <th className="">ATK</th>
                      <th className="">DEF</th>
                      <th className="">MS</th>
                    </tr>
                    <tr>
                      <th className="">AP</th>
                      <th className="">POW</th>
                      <th className="">RES</th>
                      <th className="">AS</th>
                    </tr>
                    </thead>
                    {createStatusNodes(2)}
                  </table>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="skill row">
          <dl className="col-sm-6">
            <dt><b>Active Skill</b></dt>
            {createSkillNode('active')}
          </dl>
          <dl className="col-sm-6">
            <dt><b>Passive Skill</b></dt>
            {createSkillNode('passive')}
          </dl>
        </div>
      </div>
    )
  }
}
