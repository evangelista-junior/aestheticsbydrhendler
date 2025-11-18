// jest.setup.js
import { config } from "dotenv";
import { resolve } from "path";

const rootDir = __dirname;

config({ path: resolve(rootDir, ".env") });
config({ path: resolve(rootDir, ".env.local") });
config({ path: resolve(rootDir, ".env.test") });
