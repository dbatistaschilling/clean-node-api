import { Controller, HttpResponse, HttpRequest } from '../../presentation/protocols'

export default class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await this.controller.handle(httpRequest)
    // if (httpResponse.statusCode === 500) {

    // }
    // return null
  }
}
