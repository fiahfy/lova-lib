import serialize from 'serialize-javascript'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {match} from 'redux-router/server'
import {configureStore} from '../../client/store'
import Html from '../../client/containers/html'
import Root from '../../client/containers/root'

export default (function *() {
  yield new Promise(resolve => {
    const store = configureStore()
    // store.dispatch(match(this.originalUrl, (error, redirectLocation, renderProps) => {
    //   if (error) {
    //     this.status = 500
    //     this.body = error.message
    //     return
    //   } else if (redirectLocation) {
    //     this.redirect(redirectLocation.pathname + redirectLocation.search)
    //     return
    //   } else if (!renderProps) {
    //     this.status = 404
    //     this.body = 'Not found'
    //     return
    //   }
    //
    //   store.getState().router.then(() => {
        const initialState = serialize(store.getState())

        const markup = ReactDOMServer.renderToString(
          <Root store={store} />
        )

        this.body = '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
          <Html markup={markup} initialState={initialState} />
        )
        resolve()
    //   })
    // }))
  })
})

export {default as sitemap} from './sitemap'
