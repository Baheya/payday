export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-no-unsupported-browser-features"],
  rules: {
    "plugin/no-unsupported-browser-features": [
      true,
      {
        severity: "warning",
        ignore: ["css-nesting"],
        ignorePartialSupport: true,
      },
    ],
    "custom-property-empty-line-before": null,
    "at-rule-no-unknown": null,
  },
};
