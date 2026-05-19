import Menu from "#components/Menu/Menu.astro";
import { test as baseTest } from "vitest";
import { render } from "vitest-browser-astro";

export const test = baseTest.extend("screen", async () => {
  const screen = await render(Menu, {
    props: {
      options: [
        { action: "add-fruit", label: "apple" },
        { action: "add-fruit", label: "blueberry" },
        { action: "add-fruit", label: "cantaloupe" },
        { action: "add-fruit", label: "banana" },
        { action: "add-fruit", label: "orange" },
        { action: "add-fruit", label: "raspberries" },
        { action: "add-fruit", label: "blackberry" },
        { action: "add-fruit", label: "coconut" },
        { action: "add-fruit", label: "dates" },
        { action: "add-fruit", label: "elderberry" },
        { action: "add-fruit", label: "fig" },
        { action: "add-fruit", label: "gooseberry" },
        { action: "add-fruit", label: "grapefruit" },
        { action: "add-fruit", label: "grape" },
        { action: "add-fruit", label: "guava" },
        { action: "add-fruit", label: "huckleberry" },
        { action: "add-fruit", label: "kiwi" },
        { action: "add-fruit", label: "lemon" },
        { action: "add-fruit", label: "mango" },
        { action: "add-fruit", label: "nectarine" },
      ],
    },
  });
  return screen;
});
