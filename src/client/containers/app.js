import React, {Component} from 'react'
import {Link} from 'react-router'
import Helmet from 'react-helmet'
import GoogleAnalytics from 'react-g-analytics'

export default class App extends Component {
  getMetaInfo() {
    const pathname = this.props.location.pathname
    const pathes = pathname.match(/^\/(\w+)\//)

    let title = `${_.capitalize(pathes[1])} : LoVA Tool`
    let description = 'Tool Site for Lord of Vermilion Arena'
    switch (pathes[1]) {
      case 'deck':
        description = 'Deck Simulator for Lord of Vermilion Arena'
        break;
      case 'charts':
        description = 'Charts for Lord of Vermilion Arena'
        break;
      case 'prize':
        description = 'Prize Simulator for Lord of Vermilion Arena'
        break;
      case 'about':
        break;
      case 'servants':
        description = 'Servants for Lord of Vermilion Arena'
        break;
    }

    return {title, description}
  }
  render() {
    const year = (new Date()).getFullYear()
    const {title, description} = this.getMetaInfo()

    return (
      <div>
        <Helmet title={title}
                meta={[{name: 'description', content: description}]} />
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
              <Link className="navbar-brand" to="/">LoVA Tool</Link>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li className=""><Link to="/deck/">Deck</Link></li>
                <li className=""><Link to="/servants/">Servants</Link></li>
                <li className=""><Link to="/charts/">Charts</Link></li>
                <li className=""><Link to="/prize/">Prize</Link></li>
                <li className=""><Link to="/about/">About</Link></li>
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
