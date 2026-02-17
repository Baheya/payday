import { userEvent } from "@vitest/browser/context";
import SelectOnlyCombobox from "#components/SelectOnlyCombobox/SelectOnlyCombobox.astro";
import { expect, test, describe } from "vitest";
import { render } from "vitest-browser-astro";

describe("Select-Only Combobox", () => {
  describe("Click events", () => {
    test("Combobox has DOM focus and appropriate aria attributes when toggled", async () => {
      const screen = await render(SelectOnlyCombobox, {
        props: {
          options: ["one", "two", "three"],
        },
      });
      const combobox = screen.getByRole("combobox");
      await combobox.click();
      const listBoxOption = screen.getByRole("option");

      await expect.element(combobox).toHaveFocus();
      await expect
        .element(combobox)
        .toHaveAttribute("aria-activedescendant", "option_0");
      await expect
        .element(listBoxOption.first())
        .toHaveAttribute("aria-selected", "true");
      await expect.element(listBoxOption.first()).toHaveClass("focused");
      await expect
        .element(listBoxOption.nth(1))
        .toHaveAttribute("aria-selected", "false");

      await userEvent.click(listBoxOption.nth(1));

      await expect
        .element(combobox)
        .toHaveAttribute("aria-activedescendant", "option_1");
    });
    // test("Typing after clicking on Combobox moves visual focus to matching option", async () => {
    //     const screen = await render(SelectOnlyCombobox, {
    //         props: {
    //             options: ["one", "two", "three"],
    //         },
    //     });
    // })
  });
  // broweser mode keyboard events were introduced in Vitest 4.x, which Astro is not yet compatible with
  // describe("Keyboard events", () => {
  //     test("Combobox has DOM focus and appropriate aria attributes when tabbed to", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });
  //         const combobox = screen.getByRole('combobox');
  //         const listBox = screen.getByRole("listbox");

  //         await userEvent.tab();
  //         await expect.element(combobox).toHaveFocus();
  //         await expect.element(listBox).not.toBeVisible();
  //         await userEvent.keyboard("{Enter}");
  //         await userEvent.keyboard("{/Enter}");

  //         expect(listBox).toBeVisible();
  //         await expect.element(combobox).toHaveFocus();
  //     });
  //     test("Typing while the combobox has DOM focus and is collapsed reveals the listbox and provides accessibility focus via aria-activedescendant, moving visual focus to the first option that matches the typed characters", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });
  //         const combobox = screen.getByRole('combobox');
  //         await userEvent.tab();

  //         await userEvent.keyboard("thr");

  //         await expect.element(combobox).toHaveAttribute('aria-activedescendant', 'option_3');
  //     });
  //     test("Typing the same character while the combobox has DOM focus and is collapsed reveals the listbox and provides accessibility focus via aria-activedescendant, cycling visual focus among the options starting with that character", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["apple", "blueberry", "cantaloupe", "banana", "orange", "raspberries", "blackberry"],
  //             },
  //         });
  //         const options = screen.getByRole('option');
  //         await userEvent.tab();

  //         await userEvent.keyboard("{b}");
  //         await expect.element(options.nth(3)).toHaveClass("focused");

  //         await userEvent.keyboard("{b}");
  //         await expect.element(options.nth(5)).toHaveClass("focused");

  //         await userEvent.keyboard("{b}");
  //         await expect.element(options.nth(8)).toHaveClass("focused");
  //     });
  //     test("Navigating options in the listbox always keeps the option with accessibility focus visible via scroll", async () => {
  //         const longArray = Array.from({ length: 100 }, (_v, i) => `${i}`);
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: longArray,
  //             },
  //         });

  //         await userEvent.tab();

  //         await userEvent.keyboard("{Enter}");
  //         await userEvent.keyboard("{/Enter}");

  //         await userEvent.keyboard("{End}");
  //         await userEvent.keyboard("{/End}");

  //         const options = screen.getByRole('option');

  //         await expect.element(options.last()).toBeVisible();
  //     });
  //     test("When combobox is collapsed, pressing the the following keys displays the listbox and keeps DOM focus on the combobox: DownArrow, Alt+DownArrow, Enter, Space", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();

  //         await userEvent.keyboard("{DownArrow}");
  //         await userEvent.keyboard("{/DownArrow}");

  //         const listbox = screen.getByRole('listbox');
  //         const combobox = screen.getByRole('combobox');

  //         await expect.element(listbox).toBeVisible();
  //         await expect.element(combobox).toHaveFocus();

  //         await userEvent.keyboard("{Escape}");
  //         await userEvent.keyboard("{/Escape}");

  //         await userEvent.keyboard("{Alt>}{DownArrow}");
  //         await userEvent.keyboard("{/Alt}{/DownArrow}");

  //         await expect.element(listbox).toBeVisible();
  //         await expect.element(combobox).toHaveFocus();

  //         await userEvent.keyboard("{Escape}");
  //         await userEvent.keyboard("{/Escape}");

  //         await userEvent.keyboard("{Enter}");
  //         await userEvent.keyboard("{/Enter}");

  //         await expect.element(listbox).toBeVisible();
  //         await expect.element(combobox).toHaveFocus();

  //         await userEvent.keyboard("{Escape}");
  //         await userEvent.keyboard("{/Escape}");

  //         await userEvent.keyboard("{Space}");
  //         await userEvent.keyboard("{/Space}");

  //         await expect.element(listbox).toBeVisible();
  //         await expect.element(combobox).toHaveFocus();
  //     });
  //     test("When combobox is collapsed, pressing the Up Arrow or Home key displays the listbox, moves visual focus to the first option, and keeps DOM focus on the combobox", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();

  //         await userEvent.keyboard("{UpArrow}");
  //         await userEvent.keyboard("{/UpArrow}");

  //         const listbox = screen.getByRole('listbox');
  //         const combobox = screen.getByRole('combobox');
  //         const options = screen.getByRole('option');

  //         await expect.element(listbox).toBeVisible();
  //         await expect.element(combobox).toHaveFocus();
  //         await expect.element(options.first()).toHaveClass('focused');

  //         await userEvent.keyboard("{Escape}");
  //         await userEvent.keyboard("{/Escape}");

  //         await userEvent.keyboard("{Home}");
  //         await userEvent.keyboard("{/Home}");

  //         await expect.element(listbox).toBeVisible();
  //         await expect.element(combobox).toHaveFocus();
  //         await expect.element(options.first()).toHaveClass('focused');
  //     });
  //     test("When combobox is collapsed, pressing the End key displays the listbox, moves visual focus to the last option, and keeps DOM focus on the combobox", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();

  //         await userEvent.keyboard("{End}");
  //         await userEvent.keyboard("{/End}");

  //         const listbox = screen.getByRole('listbox');
  //         const combobox = screen.getByRole('combobox');
  //         const options = screen.getByRole('option');

  //         await expect.element(listbox).toBeVisible();
  //         await expect.element(combobox).toHaveFocus();
  //         await expect.element(options.last()).toHaveClass('focused');
  //     });
  //     test("Selecting an option via the Enter, Space, or Alt+UpArrow closes the listbox, sets visual focus on the combobox, and indicates the currently selected option via aria-selected", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();

  //         await userEvent.keyboard("{End}");
  //         await userEvent.keyboard("{/End}");
  //         await userEvent.keyboard("{Enter}");
  //         await userEvent.keyboard("{/Enter}");

  //         const listbox = screen.getByRole('listbox');
  //         const combobox = screen.getByRole('combobox');
  //         const options = screen.getByRole('option');

  //         await expect.element(listbox).not.toBeVisible();
  //         await expect.element(combobox).toHaveClass("focused");
  //         await expect.element(options.last()).toHaveAttribute('aria-selected', 'true');

  //         await userEvent.keyboard("{Home}");
  //         await userEvent.keyboard("{/Home}");
  //         await userEvent.keyboard("{Space}");
  //         await userEvent.keyboard("{/Space}");

  //         await expect.element(listbox).not.toBeVisible();
  //         await expect.element(combobox).toHaveClass("focused");
  //         await expect.element(options.first()).toHaveAttribute('aria-selected', 'true');

  //         await userEvent.keyboard("{End}");
  //         await userEvent.keyboard("{/End}");
  //         await userEvent.keyboard("{Alt>}{UpArrow}");
  //         await userEvent.keyboard("{/Alt}{/UpArrow}");

  //         await expect.element(listbox).not.toBeVisible();
  //         await expect.element(combobox).toHaveClass("focused");
  //         await expect.element(options.last()).toHaveAttribute('aria-selected', 'true');
  //     });
  //     test("Selecting an option via the Tab key closes the listbox, indicates the currently selected option via aria-selected, and moves focus to the next focusable element", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();

  //         await userEvent.keyboard("{End}");
  //         await userEvent.keyboard("{/End}");
  //         await userEvent.tab();

  //         const listbox = screen.getByRole('listbox');
  //         const combobox = screen.getByRole('combobox');
  //         const options = screen.getByRole('option');

  //         await expect.element(listbox).not.toBeVisible();
  //         await expect.element(combobox).not.toHaveFocus();
  //         await expect.element(options.last()).toHaveAttribute('aria-selected', 'true');
  //     });
  //     test("Pressing the Escape key closes the listbox and sets visual focus on the combobox", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();

  //         await userEvent.keyboard("{Enter}");
  //         await userEvent.keyboard("{/Enter}");
  //         await userEvent.keyboard("{Escape}");
  //         await userEvent.keyboard("{/Escape}");

  //         const listbox = screen.getByRole('listbox');
  //         const combobox = screen.getByRole('combobox');

  //         await expect.element(listbox).not.toBeVisible();
  //         await expect.element(combobox).toHaveFocus();
  //     });
  //     test("Pressing the DownArrow key moves visual focus to the next option, and if the option is the last one then focus does not move", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();
  //         const options = screen.getByRole('option');

  //         await userEvent.keyboard("{Enter}");
  //         await userEvent.keyboard("{/Enter}");
  //         await userEvent.keyboard("{DownArrow}");
  //         await userEvent.keyboard("{/DownArrow}");

  //         await expect.element(options.first()).toHaveClass("focused");

  //         await userEvent.keyboard("{DownArrow}");
  //         await userEvent.keyboard("{/DownArrow}");
  //         await userEvent.keyboard("{DownArrow}");
  //         await userEvent.keyboard("{/DownArrow}");

  //         await expect.element(options.last()).toHaveClass("focused");

  //         await userEvent.keyboard("{DownArrow}");
  //         await userEvent.keyboard("{/DownArrow}");
  //         await expect.element(options.last()).toHaveClass("focused");
  //     });
  //     test("Pressing the UpArrow key moves visual focus to the previous option, and if the option is the first one then focus does not move", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();
  //         const options = screen.getByRole('option');

  //         await userEvent.keyboard("{End}");
  //         await userEvent.keyboard("{/End}");

  //         await expect.element(options.last()).toHaveClass("focused");

  //         await userEvent.keyboard("{UpArrow}");
  //         await userEvent.keyboard("{/UpArrow}");
  //         await userEvent.keyboard("{UpArrow}");
  //         await userEvent.keyboard("{/UpArrow}");

  //         await expect.element(options.first()).toHaveClass("focused");

  //         await userEvent.keyboard("{UpArrow}");
  //         await userEvent.keyboard("{/UpArrow}");
  //         await expect.element(options.first()).toHaveClass("focused");
  //     });
  //     test("Pressing the Home key moves visual focus to the first option", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();
  //         const options = screen.getByRole('option');

  //         await userEvent.keyboard("{Enter}");
  //         await userEvent.keyboard("{/Enter}");
  //         await userEvent.keyboard("{Home}");
  //         await userEvent.keyboard("{/Home}");

  //         await expect.element(options.first()).toHaveClass("focused");
  //     });
  //     test("Pressing the End key moves visual focus to the last option", async () => {
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: ["one", "two", "three"],
  //             },
  //         });

  //         await userEvent.tab();
  //         const options = screen.getByRole('option');

  //         await userEvent.keyboard("{Enter}");
  //         await userEvent.keyboard("{/Enter}");
  //         await userEvent.keyboard("{End}");
  //         await userEvent.keyboard("{/End}");

  //         await expect.element(options.last()).toHaveClass("focused");
  //     });
  //     test("Pressing the PageUp key Jumps visual focus up 10 options (or to first option)", async () => {
  //         const longArray = Array.from({ length: 20 }).map((_v, i) => `${i}`);
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: longArray,
  //             },
  //         });

  //         await userEvent.tab();
  //         const options = screen.getByRole('option');

  //         await userEvent.keyboard("{End}");
  //         await userEvent.keyboard("{/End}");
  //         await userEvent.keyboard("{PageUp}");
  //         await userEvent.keyboard("{/PageUp}");

  //         await expect.element(options.nth(10)).toHaveClass("focused");

  //         await userEvent.keyboard("{PageUp}");
  //         await userEvent.keyboard("{/PageUp}");
  //         await expect.element(options.first()).toHaveClass("focused");
  //     });
  //     test("Pressing the PageDown key Jumps visual focus down 10 options (or to last option)", async () => {
  //         const longArray = Array.from({ length: 20 }).map((_v, i) => `${i}`);
  //         const screen = await render(SelectOnlyCombobox, {
  //             props: {
  //                 options: longArray,
  //             },
  //         });

  //         await userEvent.tab();
  //         const options = screen.getByRole('option');

  //         await userEvent.keyboard("{Enter}");
  //         await userEvent.keyboard("{/Enter}");
  //         await userEvent.keyboard("{DownArrow}");
  //         await userEvent.keyboard("{/DownArrow}");
  //         await userEvent.keyboard("{PageDown}");
  //         await userEvent.keyboard("{/PageDown}");

  //         await expect.element(options.nth(10)).toHaveClass("focused");

  //         await userEvent.keyboard("{PageDown}");
  //         await userEvent.keyboard("{/PageDown}");

  //         await expect.element(options.last()).toHaveClass("focused");
  //     });
  // })
});
