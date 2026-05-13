import SelectOnlyCombobox from "#components/SelectOnlyCombobox/SelectOnlyCombobox.astro";
import { test as baseTest } from "vitest";
import { render } from "vitest-browser-astro";

export const test = baseTest.extend("screen", async () => {
  const screen = await render(SelectOnlyCombobox, {
    props: {
      options: [
        { label: "apple" },
        { label: "blueberry" },
        { label: "cantaloupe" },
        { label: "banana" },
        { label: "orange" },
        { label: "raspberries" },
        { label: "blackberry" },
        { label: "coconut" },
        { label: "dates" },
        { label: "elderberry" },
        { label: "fig" },
        { label: "gooseberry" },
        { label: "grapefruit" },
        { label: "grape" },
        { label: "guava" },
        { label: "huckleberry" },
        { label: "kiwi" },
        { label: "lemon" },
        { label: "mango" },
        { label: "nectarine" },
      ],
      comboboxLabel: "Sort by",
      id: "sort-combo",
      mobileTriggerIconName: "sort",
    },
  });
  return screen;
});
