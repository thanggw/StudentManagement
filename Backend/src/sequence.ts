import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  RequestContext,
  RestBindings,
  Send,
  Reject,
  SequenceHandler,
  SequenceActions,
  InvokeMiddleware,
} from '@loopback/rest';
import {inject} from '@loopback/core';

const SequenceActionsAlias = SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActionsAlias.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActionsAlias.PARSE_PARAMS)
    protected parseParams: ParseParams,
    @inject(SequenceActionsAlias.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActionsAlias.SEND) protected send: Send,
    @inject(SequenceActionsAlias.REJECT) protected reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject(SequenceActionsAlias.INVOKE_MIDDLEWARE)
    protected invokeMiddleware: InvokeMiddleware,
  ) {}

  async handle(context: RequestContext) {
    const {request, response} = context;

    const finished = await this.invokeMiddleware(context);
    if (finished) return;

    try {
      const route = this.findRoute(request);
      await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401});
      }
      this.reject(context, err);
    }
  }
}
