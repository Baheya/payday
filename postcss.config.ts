import postcssGlobalData from "@csstools/postcss-global-data";
import path from "node:path";
import postcssMixins from "postcss-mixins";
import postcssPresetEnv from "postcss-preset-env";

export default {
  plugins: [
    postcssGlobalData({
      files: [
        "./src/styles/global.css",
        "./src/styles/media.css",
        "./src/styles/mixins.css",
      ],
    }),
    postcssMixins({ mixinsDir: path.join(__dirname, "src/styles/mixins.css") }),
    postcssPresetEnv({
      features: { "nesting-rules": true, "custom-media-queries": true },
    }),
  ],
};
