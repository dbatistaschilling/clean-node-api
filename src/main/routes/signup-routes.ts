import { adaptRoute } from './../adapters/express-route-adapter'
import { Router } from 'express'
import { makeSignUpcController } from './../factories/signup'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpcController()))
}
