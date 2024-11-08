import {
  RequestContext,
  ResponseContext,
  Middleware,
} from "@inquisico/ruleset-editor-api";
import { getSession } from "next-auth/react";

export default class PeflightHeadersMiddleware implements Middleware {
  async pre(context: RequestContext): Promise<RequestContext> {
    const session = await getSession();
    context.setHeaderParam("Content-Type", "application/json");
    if (session) {
      if (session.accessToken) {
        context.setHeaderParam("Bearer", session.accessToken);
      } 
    }
    return Promise.resolve(context);
  }

  post(context: ResponseContext): Promise<ResponseContext> {
    return Promise.resolve(context);
  }
}
