// jest.setup.js
import { config } from "dotenv";
import { TextEncoder, TextDecoder } from "util";
import "cross-fetch/polyfill";

// Carrega envs a partir da raiz do projeto
config({ path: ".env" });
config({ path: ".env.local" });
config({ path: ".env.test" });

// Polyfill para TextEncoder/TextDecoder (Next/Jest precisam disso em Node/jsdom)
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

// Polyfill de fetch/Request/Response/Headers com cross-fetch
if (typeof global.Request === "undefined" && typeof Request !== "undefined") {
  global.Request = Request;
}
if (typeof global.Response === "undefined" && typeof Response !== "undefined") {
  global.Response = Response;
}
if (typeof global.Headers === "undefined" && typeof Headers !== "undefined") {
  global.Headers = Headers;
}
