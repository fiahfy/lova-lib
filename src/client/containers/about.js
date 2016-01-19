import React, {Component} from 'react'

export default class About extends Component {
  componentDidMount() {
    const mail = 'd.fiahfy@gmail.com'
    this.refs.mail.href = `mailto:${mail}`
    this.refs.mail.text = mail
  }
  render() {
    return (
      <div className="container" id="about">
        <div className="page-header">
          <h2>About</h2>
        </div>
        
        <address>
          <strong>Mail</strong><br />
          <a className="mail" ref="mail" /><br />
          <strong>Issue</strong><br />
          <a href="https://github.com/fiahfy/lova-lib/issues">
            https://github.com/fiahfy/lova-lib/issues
          </a>
        </address>
      </div>
    )
  }
}
