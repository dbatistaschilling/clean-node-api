import { Controller } from './../../presentation/protocols/controller'
import { AccountMongoRepository } from './../../infra/db/mongodb/account-repository/account'
import { BcryptAdapter } from './../../infra/criptography/bcrypt-adapter'
import { EmailValidatorAdapter } from './../../utils/email-validator/email-validator-adapter'
import { SignUpController } from './../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import LogControllerDecorator from '../decorators/log'

export const makeSignUpcController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUp = new SignUpController(emailValidatorAdapter, dbAddAccount)
  return new LogControllerDecorator(signUp)
}
