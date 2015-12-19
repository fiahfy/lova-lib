import koaRouter from 'koa-router'
import rootController, * as controllers from './controllers'
import apiRootController, * as apiControllers from './controllers/api'

const router = koaRouter()

router.get('/sitemap.xml', controllers.sitemap)
router.get('/api/', apiRootController)
router.get('/api/servants/', apiControllers.servant)
router.get('/api/servants/:id/', apiControllers.servant)
router.get('/api/prizes/', apiControllers.prize)
/// deprecated
// router.get('/api/ranking/servants/:mode/:year/:month/:date/', controllers.ranking.servants)
// router.get('/api/ranking/servants/:mode/latest/', controllers.ranking.servants)
// router.get('/api/ranking/servants/:id/:mode/:year/:month/:date/', controllers.ranking.servants)
///
router.get('/api/servants/statistics/', apiControllers.servantStatistics)
router.get('/api/spells/statistics/', apiControllers.spellStatistics)
router.get('*', rootController)

export default router.routes()
