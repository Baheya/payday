import SelectOnlyCombobox from "#components/SelectOnlyCombobox/SelectOnlyCombobox.astro";
import { test as baseTest } from "vitest";
import { render } from "vitest-browser-astro";

export const test = baseTest.extend("screen", async () => {
  const screen = await render(SelectOnlyCombobox, {
    props: {
      options: [
        { name: "apple" },
        { name: "blueberry" },
        { name: "cantaloupe" },
        { name: "banana" },
        { name: "orange" },
        { name: "raspberries" },
        { name: "blackberry" },
        { name: "coconut" },
        { name: "dates" },
        { name: "elderberry" },
        { name: "fig" },
        { name: "gooseberry" },
        { name: "grapefruit" },
        { name: "grape" },
        { name: "guava" },
        { name: "huckleberry" },
        { name: "kiwi" },
        { name: "lemon" },
        { name: "mango" },
        { name: "nectarine" },
      ],
      comboboxLabel: "Sort by",
      id: "sort-combo",
      mobileTriggerIconName: "sort",
    },
  });
  return screen;
});
