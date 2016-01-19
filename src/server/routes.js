import koaRouter from 'koa-router'
import rootController, * as controllers from './controllers'
import apiRootController, * as apiControllers from './controllers/api'

const router = koaRouter()

router.get('/sitemap.xml', controllers.sitemap)
router.get('/api/', apiRootController)
router.get('/api/servants/', apiControllers.servant)
router.get('/api/servants/:id/', apiControllers.servant)
router.get('/api/prizes/', apiControllers.prize)
router.get('/api/servants/statistics/', apiControllers.servantStatistics)
router.get('/api/spells/statistics/', apiControllers.spellStatistics)
router.get('/assets/*', function *() {
  this.status = 404
})
router.get('*', rootController)

export default router.routes()
