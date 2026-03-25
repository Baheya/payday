import SelectOnlyCombobox from "#components/SelectOnlyCombobox/SelectOnlyCombobox.astro";
import { test as baseTest } from "vitest";
import { render } from "vitest-browser-astro";

export const test = baseTest.extend("screen", async () => {
  const screen = await render(SelectOnlyCombobox, {
    props: {
      options: [
        "apple",
        "blueberry",
        "cantaloupe",
        "banana",
        "orange",
        "raspberries",
        "blackberry",
        "coconut",
        "dates",
        "elderberry",
        "fig",
        "gooseberry",
        "grapefruit",
        "grape",
        "guava",
        "huckleberry",
        "kiwi",
        "lemon",
        "mango",
        "nectarine",
      ],
      comboboxLabel: "Sort by",
      id: "sort-combo",
      mobileTriggerIconName: "sort",
    },
  });
  return screen;
});
