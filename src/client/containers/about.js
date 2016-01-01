import React, {Component} from 'react'

export default class About extends Component {
  componentDidMount() {
    const mail = 'd.fiahfy@gmail.com'
    $('.mail').attr('href', `mailto:${mail}`).text(mail)
  }
  render() {
    return (
      <div className="container" id="about">
        <div className="page-header">
          <h2>About</h2>
        </div>
        <address>
          <strong>Mail</strong><br />
          <a className="mail" /><br />
          <strong>Issue</strong><br />
          <a href="https://github.com/fiahfy/lovalib/issues">https://github.com/fiahfy/lovalib/issues</a>
        </address>
      </div>
    )
  }
}
