import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {match} from 'react-router'
import {loadOnServer} from 'redux-async-connect'
import serialize from 'serialize-javascript'
import config from '../../config'
import history from '../../client/history'
import routes from '../../client/routes'
import {configureStore} from '../../client/store'
import Html from '../../client/containers/html'
import Root from '../../client/containers/root'

export {default as sitemap} from './sitemap'

export default async function (ctx) {
  await new Promise(resolve => {
    const store = configureStore(history)
    match({history, routes, location: ctx.originalUrl}, (error, redirectLocation, renderProps) => {
      if (error) {
        ctx.status = 500
        ctx.body = error.message
        resolve()
        return
      } else if (redirectLocation) {
        ctx.redirect(redirectLocation.pathname + redirectLocation.search)
        resolve()
        return
      } else if (!renderProps) {
        ctx.status = 404
        ctx.body = 'Not found'
        resolve()
        return
      }

      loadOnServer({...renderProps, store}).then(() => {
        try {
          const initialState = serialize(store.getState())

          const markup = ReactDOMServer.renderToString(
            <Root store={store} renderProps={renderProps} />
          )

          ctx.body = '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
            <Html markup={markup} initialState={initialState} />
          )
        } catch (e) {
          ctx.status = 500
          if (config.env === 'development') {
            ctx.body = e.stack
          }
          console.error(e.stack) // eslint-disable-line no-console
        }
        resolve()
      })
    })
  })
}
