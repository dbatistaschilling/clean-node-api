import { LogErrorRepository } from './../../data/protocols/log-error-repository'
import LogControllerDecorator from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { serverError, ok } from '../../presentation/helpers/http-helper'

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoyStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoyStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeData())))
    }
  }
  return new ControllerStub()
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeFakeData = (): any => ({
  data: 'any_data'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    data: 'any_data'
  }
})

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoyStub: LogErrorRepository
}

const makeSut = (): any => {
  const controllerStub = makeController()
  const logErrorRepositoyStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoyStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoyStub
  }
}

describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeData()))
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoyStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoyStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
