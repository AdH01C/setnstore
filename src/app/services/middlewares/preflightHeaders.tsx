import {
  RequestContext,
  ResponseContext,
  Middleware,
} from "@inquisico/ruleset-editor-api";

export default class PeflightHeadersMiddleware implements Middleware {
  pre(context: RequestContext): Promise<RequestContext> {
    context.setHeaderParam("Content-Type", "application/json");
    return Promise.resolve(context);
  }

  post(context: ResponseContext): Promise<ResponseContext> {
    return Promise.resolve(context);
  }
}
