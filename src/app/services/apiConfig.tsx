import {
  PromiseHttpLibrary,
  RequestContext,
  ResponseContext,
  ServerConfiguration,
  createConfiguration,
  wrapHttpLibrary,
} from "@inquisico/ruleset-editor-api";
const addTrailingSlash = (url: string) => url.replace(/\/?$/, "/");

class IsomorphicFetchHttpLibrary implements PromiseHttpLibrary {
  _isRedirect = true;

  constructor(isRedirect = true) {
    this._isRedirect = isRedirect;
  }

  // eslint-disable-next-line class-methods-use-this
  public send(request: RequestContext): Promise<ResponseContext> {
    const method = request.getHttpMethod().toString();
    const body = request.getBody();

    const resultPromise = fetch(request.getUrl(), {
      method,
      body,
      headers: request.getHeaders(),
      credentials: "include",
    })
      .then(resp => {
        const headers: { [name: string]: string } = {};
        resp.headers.forEach((value: string, name: string) => {
          headers[name] = value;
        });

        const resbody = {
          text: () => resp.text(),
          binary: () => resp.blob(),
        };
        return new ResponseContext(resp.status, headers, resbody);
      })
      .then(resp => {
        if (resp.httpStatusCode === 401 && this._isRedirect) {
          window.location.replace(new URL("login", addTrailingSlash(process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? "")));
        }

        return resp;
      });

    return resultPromise;
  }
}

const portalApi: string = process.env.NEXT_PUBLIC_PORTAL_API_URL || "";
const baseUrl = portalApi.endsWith("/") ? portalApi.slice(0, -1) : portalApi;

const configuration = (isRedirect = true) =>
  createConfiguration({
    baseServer: new ServerConfiguration<{ basePath: string }>(`${baseUrl}/{basePath}`, {
      basePath: "v0",
    }),
    httpApi: wrapHttpLibrary(new IsomorphicFetchHttpLibrary(isRedirect)),
  });

export default configuration;
