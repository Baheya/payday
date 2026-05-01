import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";
import { readFileSync } from "node:fs";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  devToolbar: {
    enabled: false,
  },
  vite: {
    server: {
      https: {
        cert: readFileSync("./cert.pem"),
        key: readFileSync("./key.pem"),
      },
    },
  },
});
