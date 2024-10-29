import {
  createConfiguration,
  server3 as customServer,
} from "@inquisico/ruleset-editor-api";
import NgrokMiddleware from "./middlewares/ngrok";
import PreflightHeadersMiddleware from "./middlewares/preflightHeaders";

const url = process.env.NEXT_PUBLIC_BACKEND!;
const [scheme, address] = url.split("://");
const basePath = process.env.NEXT_PUBLIC_BACKEND_BASE_PATH!;

// Set custom server variables (i.e. scheme: 'http', address: 'localhost:3000', basePath: 'v0')
customServer.setVariables({
  scheme: scheme,
  address: address,
  basePath: basePath,
});

const configuration = createConfiguration({
  baseServer: customServer,
  promiseMiddleware: [new NgrokMiddleware(), new PreflightHeadersMiddleware()],
});

export default configuration;
