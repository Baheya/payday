export default {
  extends: ["stylelint-config-standard", "stylelint-config-clean-order"],
  plugins: ["stylelint-no-unsupported-browser-features", "stylelint-order"],
  rules: {
    "plugin/no-unsupported-browser-features": [
      true,
      {
        severity: "warning",
        ignore: ["css-nesting"],
        ignorePartialSupport: true,
      },
    ],
    "nesting-selector-no-missing-scoping-root": [
      true,
      { ignoreAtRules: ["/^define-mixin/"] },
    ],
    "custom-property-empty-line-before": null,
    "at-rule-no-unknown": null,
    "selector-not-notation": null,
  },
};
