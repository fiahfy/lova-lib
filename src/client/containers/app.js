import React, {Component} from 'react'
import {Link} from 'react-router'
import Helmet from 'react-helmet'
import GoogleAnalytics from 'react-g-analytics'

export default class App extends Component {
  getHelmet() {
    const pathname = this.props.location.pathname
    const pathes = pathname.match(/^\/(\w+)\//)

    const title = _.capitalize(pathes[1])
    let description
    switch (pathes[1]) {
    case 'deck':
      description = 'Deck Simulator'
      break
    case 'charts':
      description = 'Charts'
      break
    case 'prize':
      description = 'Prize Simulator'
      break
    case 'servants':
      description = 'Servants'
      break
    case 'about':
    default:
      description = 'Site'
      break
    }
    description += ' for Lord of Vermilion Arena'

    return <Helmet title={title}
                   titleTemplate={'%s : LoVA Lib'}
                   meta={[{name: 'description', content: description}]} />
  }
  render() {
    const year = (new Date()).getFullYear()
    const helmet = this.getHelmet()

    return (
      <div>
        {helmet}
        <GoogleAnalytics id="UA-41512550-9" />
        <nav className="navbar navbar-default">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed"
                      data-toggle="collapse" data-target="#navbar"
                      aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <Link className="navbar-brand" to="/">LoVA Lib</Link>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li><Link to="/deck/">Deck</Link></li>
                <li><Link to="/servants/">Servants</Link></li>
                <li><Link to="/charts/">Charts</Link></li>
                <li><Link to="/prize/">Prize</Link></li>
                <li><Link to="/about/">About</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        {this.props.children}
        <footer className="footer">
          <div>
            <div className="container">
              <p className="text-center text-muted">
                © 2014-{year} SQUARE ENIX CO., LTD. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}
