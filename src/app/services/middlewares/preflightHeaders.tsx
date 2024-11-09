import {
  RequestContext,
  ResponseContext,
  Middleware,
} from "@inquisico/ruleset-editor-api";
import { getSession } from "next-auth/react";

export default class PeflightHeadersMiddleware implements Middleware {
  async pre(context: RequestContext): Promise<RequestContext> {
    context.setHeaderParam("Content-Type", "application/json");
    // Remove the Authorization header as we are relying on the session cookie
    return Promise.resolve(context);
  }

  post(context: ResponseContext): Promise<ResponseContext> {
    return Promise.resolve(context);
  }
}
