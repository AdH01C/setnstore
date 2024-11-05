import {
  createConfiguration,
  ServerConfiguration,
  PromiseHttpLibrary,
  RequestContext,
  ResponseContext,
  wrapHttpLibrary,
  server3 as customServer,
} from "@inquisico/ruleset-editor-api";

class IsomorphicFetchHttpLibrary implements PromiseHttpLibrary {
  _isRedirect: boolean;

  constructor(isRedirect: boolean) {
    this._isRedirect = isRedirect;
  }

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
          window.location.replace(new URL("login", process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? ""));
        }

        return resp;
      });

    return resultPromise;
  }
}

// Extract server URL and base path from environment variables
const url = process.env.NEXT_PUBLIC_BACKEND!;
const [scheme, address] = url.split("://");
const basePath = process.env.NEXT_PUBLIC_BACKEND_BASE_PATH!;

// Set custom server variables
customServer.setVariables({
  scheme: scheme,
  address: address,
  basePath: basePath,
});

// Configuration with custom HTTP library (like in the AppCDE version) and promiseMiddleware
const configuration = (isRedirect = true) =>
  createConfiguration({
    baseServer: new ServerConfiguration<{ basePath: string }>(`${url}/{basePath}`, {
      basePath: "v0",
    }),
    httpApi: wrapHttpLibrary(new IsomorphicFetchHttpLibrary(isRedirect)),
});

export default configuration;
