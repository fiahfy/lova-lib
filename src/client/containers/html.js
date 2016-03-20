import React, {Component, PropTypes} from 'react'
import Helmet from 'react-helmet'
import CSS1 from 'bootstrap/dist/css/bootstrap.css'
import CSS2 from 'flat-ui/dist/css/flat-ui.css'
import CSS3 from 'nvd3/build/nv.d3.css'
import appCSS from '../../../public/assets/css/app.scss'

const styles = [
  CSS1, CSS2, CSS3, appCSS
]

export default class Html extends Component {
  static propTypes = {
    markup:       PropTypes.string,
    initialState: PropTypes.string
  };
  render() {
    const {markup, initialState} = this.props

    const head = Helmet.rewind()

    const CSSString = styles.map(style => style.toString()).join('\n')

    return (
      <html>
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,user-scalable=0,initial-scale=1" />
          <base href="/" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <style dangerouslySetInnerHTML={{__html: CSSString}} />
          <script src="/assets/js/bundle.js" defer></script>
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{__html: markup}} />
          <script dangerouslySetInnerHTML={{__html: `window.__initialState=${initialState}`}} />
        </body>
      </html>
    )
  }
}
