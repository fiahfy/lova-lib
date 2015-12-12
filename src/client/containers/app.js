import React, {Component} from 'react'
import {Link} from 'react-router'

export default class App extends Component {
  render() {
    const year = (new Date()).getFullYear()
    return (
      <div>
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
