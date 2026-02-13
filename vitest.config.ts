import { getViteConfig } from "astro/config";
import { astroRenderer } from "vitest-browser-astro/plugin";

export default getViteConfig({
  plugins: [astroRenderer()],
  test: {
    browser: {
      provider: "playwright",
      enabled: true,
      headless: true,
      name: "chromium",
    },
  },
});
