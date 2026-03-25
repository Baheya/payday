import { test } from "./fixture.ts";
import { expect, describe } from "vitest";
import { userEvent } from "vitest/browser";

describe("Select-Only Combobox", () => {
  describe("Click events", () => {
    test("Combobox has DOM focus and appropriate aria attributes when toggled", async ({
      screen,
    }) => {
      const combobox = screen.getByRole("combobox");
      await combobox.click();
      const listBoxOption = screen.getByRole("option");

      await expect.element(combobox).toHaveFocus();
      await expect
        .element(combobox)
        .toHaveAttribute(
          "aria-activedescendant",
          listBoxOption.first().element().id,
        );
      await expect
        .element(listBoxOption.first())
        .toHaveAttribute("aria-selected", "true");
      await expect
        .element(listBoxOption.first())
        .toHaveAttribute("data-focused");
      await expect
        .element(listBoxOption.nth(1))
        .toHaveAttribute("aria-selected", "false");

      await userEvent.click(listBoxOption.nth(1));

      await expect
        .element(combobox)
        .toHaveAttribute("aria-activedescendant", "");
      await expect
        .element(listBoxOption.nth(1))
        .toHaveAttribute("aria-selected", "true");
      await expect
        .element(listBoxOption.nth(1))
        .toHaveAttribute("data-focused");
    });
    test("Typing after clicking on Combobox moves visual focus to matching option", async ({
      screen,
    }) => {
      const combobox = screen.getByRole("combobox");
      await userEvent.click(combobox);
      const listBoxOption = screen.getByRole("option");
      await userEvent.keyboard("tw");
      await expect
        .element(listBoxOption.nth(1))
        .toHaveAttribute("data-focused");
    });
  });
  // broweser mode keyboard events were introduced in Vitest 4.x, which Astro is not yet compatible with
  describe("Keyboard events", () => {
    test("Combobox has DOM focus and appropriate aria attributes when tabbed to", async ({
      screen,
    }) => {
      const component = screen.getByTestId("select-only-combobox");
      const combobox = screen.getByRole("combobox");

      await userEvent.keyboard("{Tab}{/Tab}");
      await expect.element(combobox).toHaveFocus();
      await expect.element(component).not.toHaveAttribute("data-open");
      await userEvent.keyboard("{Enter}{/Enter}");

      expect(component).toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();
    });
    test("Typing while the combobox has DOM focus and is collapsed reveals the listbox and provides accessibility focus via aria-activedescendant, moving visual focus to the first option that matches the typed characters", async ({
      screen,
    }) => {
      const combobox = screen.getByRole("combobox");
      const listbox = screen.getByRole("option");
      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("goo");

      await expect
        .element(combobox)
        .toHaveAttribute("aria-activedescendant", listbox.nth(11).element().id);
    });
    test("When combobox is collapsed, pressing the the following keys displays the listbox and keeps DOM focus on the combobox: DownArrow, Alt+DownArrow, Enter, Space", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");

      const component = screen.getByTestId("select-only-combobox");
      const combobox = screen.getByRole("combobox");

      await expect.element(component).toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();

      await userEvent.keyboard("{Escape}{/Escape}");

      await userEvent.keyboard("{Alt>}{ArrowDown}{/ArrowDown}{/Alt}");

      await expect.element(component).toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();

      await userEvent.keyboard("{Escape}{/Escape}");

      await userEvent.keyboard("{Enter}{/Enter}");

      await expect.element(component).toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();

      await userEvent.keyboard("{Escape}{/Escape}");

      await userEvent.keyboard("{Space}{/Space}");

      await expect.element(component).toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();
    });
    test("When combobox is collapsed, pressing the Up Arrow or Home key displays the listbox, moves visual focus to the first option, and keeps DOM focus on the combobox", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");

      const component = screen.getByTestId("select-only-combobox");
      const combobox = screen.getByRole("combobox");
      const options = screen.getByRole("option");

      await expect.element(component).toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();
      await expect.element(options.first()).toHaveAttribute("data-focused");

      await userEvent.keyboard("{Escape}{/Escape}");

      await userEvent.keyboard("{Home}{/Home}");

      await expect.element(component).toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();
      await expect.element(options.first()).toHaveAttribute("data-focused");
    });
    test("When combobox is collapsed, pressing the End key displays the listbox, moves visual focus to the last option, and keeps DOM focus on the combobox", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{End}{/End}");

      const component = screen.getByTestId("select-only-combobox");
      const combobox = screen.getByRole("combobox");
      const options = screen.getByRole("option");

      await expect.element(component).toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();
      await expect.element(options.last()).toHaveAttribute("data-focused");
    });
    test("Selecting an option via the Enter, Space, or Alt+UpArrow closes the listbox, sets visual focus on the combobox, and indicates the currently selected option via aria-selected", async ({
      screen,
    }) => {
      const component = screen.getByTestId("select-only-combobox");
      const combobox = screen.getByRole("combobox");
      const options = screen.getByRole("option");

      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{End}{/End}");
      await userEvent.keyboard("{Enter}{/Enter}");

      await expect.element(component).not.toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();
      await expect
        .element(options.last().element())
        .toHaveAttribute("aria-selected", "true");

      await userEvent.keyboard("{Home}{/Home}");
      await userEvent.keyboard("{Space}{/Space}");

      await expect.element(component).not.toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();
      await expect
        .element(options.first())
        .toHaveAttribute("aria-selected", "true");

      await userEvent.keyboard("{End}{/End}");
      await userEvent.keyboard("{Alt>}{ArrowUp}{/ArrowUp}{/Alt}");

      await expect.element(component).not.toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();
      await expect
        .element(options.last().element())
        .toHaveAttribute("aria-selected", "true");
    });
    test("Selecting an option via the Tab key closes the listbox, indicates the currently selected option via aria-selected, and moves focus to the next focusable element", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{End}{/End}");
      await userEvent.keyboard("{Tab}{/Tab}");

      const component = screen.getByTestId("select-only-combobox");
      const combobox = screen.getByRole("combobox");
      const options = screen.getByRole("option");

      await expect.element(component).not.toHaveAttribute("data-open");
      await expect.element(combobox).not.toHaveFocus();
      await expect
        .element(options.last())
        .toHaveAttribute("aria-selected", "true");
    });
    test("Pressing the Escape key closes the listbox and sets visual focus on the combobox", async ({
      screen,
    }) => {
      const component = screen.getByTestId("select-only-combobox");
      const combobox = screen.getByRole("combobox");

      await userEvent.keyboard("{Tab}{/Tab}");
      await expect.element(combobox).toHaveFocus();
      await userEvent.keyboard("{Enter}{/Enter}");
      await expect.element(component).toHaveAttribute("data-open");
      await userEvent.keyboard("{Escape}{/Escape}");

      await expect.element(component).not.toHaveAttribute("data-open");
      await expect.element(combobox).toHaveFocus();
    });
    test("Pressing the DownArrow key moves visual focus to the next option, and if the option is the last one then focus does not move", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");
      const options = screen.getByRole("option");

      await userEvent.keyboard("{Enter}{/Enter}");

      await expect.element(options.first()).toHaveAttribute("data-focused");

      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");
      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");

      await expect.element(options.nth(2)).toHaveAttribute("data-focused");

      await userEvent.keyboard("{PageDown}{/PageDown}");
      await userEvent.keyboard("{PageDown}{/PageDown}");
      await expect.element(options.last()).toHaveAttribute("data-focused");
      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");
      await expect.element(options.last()).toHaveAttribute("data-focused");
    });
    test("Pressing the UpArrow key moves visual focus to the previous option, and if the option is the first one then focus does not move", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");
      const options = screen.getByRole("option");

      await userEvent.keyboard("{End}{/End}");

      await expect.element(options.last()).toHaveAttribute("data-focused");

      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");
      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");

      await expect.element(options.nth(17)).toHaveAttribute("data-focused");

      await userEvent.keyboard("{PageUp}{/PageUp}");
      await userEvent.keyboard("{PageUp}{/PageUp}");
      await expect.element(options.first()).toHaveAttribute("data-focused");
      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");
      await expect.element(options.first()).toHaveAttribute("data-focused");
    });
    test("Pressing the Home key moves visual focus to the first option", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");
      const options = screen.getByRole("option");

      await userEvent.keyboard("{Enter}{/Enter}");
      await userEvent.keyboard("{Home}{/Home}");

      await expect.element(options.first()).toHaveAttribute("data-focused");
    });
    test("Pressing the End key moves visual focus to the last option", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");
      const options = screen.getByRole("option");

      await userEvent.keyboard("{Enter}{/Enter}");
      await userEvent.keyboard("{End}{/End}");

      await expect.element(options.last()).toHaveAttribute("data-focused");
    });
    test("Pressing the PageUp key Jumps visual focus up 10 options (or to first option)", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");
      const options = screen.getByRole("option");

      await userEvent.keyboard("{End}{/End}");
      await userEvent.keyboard("{PageUp}{/PageUp}");

      await expect.element(options.nth(9)).toHaveAttribute("data-focused");

      await userEvent.keyboard("{PageUp}{/PageUp}");
      await expect.element(options.first()).toHaveAttribute("data-focused");
    });
    test("Pressing the PageDown key Jumps visual focus down 10 options (or to last option)", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");
      const options = screen.getByRole("option");

      await userEvent.keyboard("{Enter}{/Enter}");
      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");
      await userEvent.keyboard("{PageDown}{/PageDown}");

      await expect.element(options.nth(11)).toHaveAttribute("data-focused");

      await userEvent.keyboard("{PageDown}{/PageDown}");
      await userEvent.keyboard("{PageDown}{/PageDown}");

      await expect.element(options.last()).toHaveAttribute("data-focused");
    });
    test("Navigating options in the listbox always keeps the option with accessibility focus visible via scroll", async ({
      screen,
    }) => {
      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{Enter}{/Enter}");

      await userEvent.keyboard("{End}{/End}");

      const options = screen.getByRole("option");

      await expect.element(options.last()).toBeInViewport();
    });
    test("Typing the same character while the combobox has DOM focus and is collapsed reveals the listbox and provides accessibility focus via aria-activedescendant, cycling visual focus among the options starting with that character", async ({
      screen,
    }) => {
      const options = screen.getByRole("option");
      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("b");
      await expect.element(options.nth(1)).toHaveAttribute("data-focused");

      await userEvent.keyboard("b");
      await expect.element(options.nth(3)).toHaveAttribute("data-focused");

      await userEvent.keyboard("b");
      await expect.element(options.nth(6)).toHaveAttribute("data-focused");
    });
  });
});
