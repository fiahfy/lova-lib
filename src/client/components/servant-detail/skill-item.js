import React, {Component, PropTypes} from 'react'

export default class SkillItem extends Component {
  static propTypes = {
    name:        PropTypes.string,
    description: PropTypes.string,
    designation: PropTypes.string,
    effect:      PropTypes.string,
    cd:          PropTypes.arrayOf(PropTypes.number),
    ap:          PropTypes.arrayOf(PropTypes.number)
  };
  descriptionHTML() {
    const {description, cd, ap} = this.props

    let html = description
      .replace(/(^|\n)\d+\.\s/g, '$1')
      .replace(/\n/g, '<br /><br />')
      .replace(/［([^］]+)］/g, '<br/>&nbsp&nbsp<b>- $1</b>')
      .replace(/：/g, ' : ')

    if (cd && cd.length) {
      html = html.replace(/<br *\/>/,
        '<br />&nbsp&nbsp<b>- クールダウン : ' + cd.join(' / ') + '</b><br />')
    }

    if (ap && cd.length) {
      html = html.replace(/<br *\/>/,
        '<br />&nbsp&nbsp<b>- 消費AP : ' + ap.join(' / ') + '</b><br />')
    }

    return html
  }
  render() {
    const {name, designation, effect} = this.props

    if (!name) {
      return (
        <dd>
          <dl className="row">
            <dd className="col-xs-12">
              <div className="well well-sm">
                <small>None</small>
              </div>
            </dd>
          </dl>
        </dd>
      )
    }
    return (
      <dd>
        <dl className="row">
          <dt className="col-xs-3">Name</dt>
          <dd className="col-xs-9">{name}</dd>
        </dl>
        <dl className="row">
          <dt className="col-xs-3">Designation</dt>
          <dd className="col-xs-9">{(designation || '').replace(',', '・') || '-'}</dd>
        </dl>
        <dl className="row">
          <dt className="col-xs-3">Effect</dt>
          <dd className="col-xs-9">{(effect || '').replace(',', '・') || '-'}</dd>
        </dl>
        <dl className="row">
          <dt className="col-xs-12">Description</dt>
          <dd className="col-xs-12">
            <div className="well well-sm">
              <small dangerouslySetInnerHTML={{__html: this.descriptionHTML()}} />
            </div>
          </dd>
        </dl>
      </dd>
    )
  }
}
