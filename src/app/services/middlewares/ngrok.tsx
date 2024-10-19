import { RequestContext, ResponseContext, Middleware } from "@inquisico/ruleset-editor-api";

export default class NgrokMiddleware implements Middleware {
  pre(context: RequestContext): Promise<RequestContext> {
    context.setHeaderParam("ngrok-skip-browser-warning", "true");
    return Promise.resolve(context);
  }

  post(context: ResponseContext): Promise<ResponseContext> {
    return Promise.resolve(context);
  }
}
