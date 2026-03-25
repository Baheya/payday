import { playwright } from "@vitest/browser-playwright";
import { getViteConfig } from "astro/config";
import { astroRenderer } from "vitest-browser-astro/plugin";

export default getViteConfig({
  plugins: [astroRenderer()],
  // @ts-expect-error outdated type that will be fixed with the next astro upgrade
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
