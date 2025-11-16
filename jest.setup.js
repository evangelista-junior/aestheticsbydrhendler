// jest.setup.js
import { config } from "dotenv";
import { resolve } from "path";

// .env.test sobrescreve .env.local que sobrescreve .env
config({ path: resolve(__dirname, ".env") });
config({ path: resolve(__dirname, ".env.local") });
config({ path: resolve(__dirname, ".env.test") });
