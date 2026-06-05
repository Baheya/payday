import { playwright } from "@vitest/browser-playwright";
import { getViteConfig } from "astro/config";
import { astroRenderer } from "vitest-browser-astro/plugin";
export default getViteConfig({
  // @ts-expect-error incompatible types due to outdated plugin
  plugins: [astroRenderer()],
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
    },
    isolate: true,
    fileParallelism: true,
  },
});
