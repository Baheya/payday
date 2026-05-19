import { test } from "./fixture.ts";
import { describe, expect } from "vitest";
import { userEvent } from "vitest/browser";

// TODO: add test statements for actions triggered

describe("Menu component", () => {
  describe("Menu button keyboard events", () => {
    test("Down Arrow, Space, and Enter keys open menu and move focus to first menuitem", async ({
      screen,
    }) => {
      const menuButton = screen.getByRole("button");
      const menuitems = screen.getByRole("menuitem");

      await userEvent.keyboard("{Tab}{/Tab}");
      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");
      const menu = screen.getByRole("menu");
      await expect.element(menu).toHaveAttribute("data-menu-open", "true");
      await expect.element(menuButton).toHaveAttribute("aria-expanded", "true");
      await expect.element(menuitems.first()).toHaveFocus();
      await expect.element(menuitems.last()).not.toHaveFocus();

      await userEvent.keyboard("{Escape}{/Escape}");
      await expect.element(menu).toHaveAttribute("data-menu-open", "false");
      await expect
        .element(menuButton)
        .toHaveAttribute("aria-expanded", "false");

      await userEvent.keyboard("{Space}{/Space}");
      await expect.element(menu).toHaveAttribute("data-menu-open", "true");
      await expect.element(menuitems.first()).toHaveFocus();

      await userEvent.keyboard("{Escape}{/Escape}");

      await userEvent.keyboard("{Enter}{/Enter}");
      await expect.element(menu).toHaveAttribute("data-menu-open", "true");
      await expect.element(menuitems.first()).toHaveFocus();
      await expect.element(menuitems.last()).not.toHaveFocus();
    });
    test("Up Arrow key opens menu and moves focus to last menuitem", async ({
      screen,
    }) => {
      const menu = screen.getByRole("menu");
      const menuitems = screen.getByRole("menuitem");

      await userEvent.keyboard("{Tab}{/Tab}");
      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");
      await expect.element(menu).toHaveAttribute("data-menu-open", "true");
      await expect.element(menuitems.last()).toHaveFocus();
      await expect.element(menuitems.first()).not.toHaveFocus();
    });
  });
  describe("Menu keyboard events", () => {
    test("Escape key closes the menu item and sets focus on the menu button", async ({
      screen,
    }) => {
      const menuButton = screen.getByRole("button");
      const menu = screen.getByRole("menu");

      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");
      await userEvent.keyboard("{Escape}{/Escape}");

      await expect.element(menu).toHaveAttribute("data-menu-open", "false");
      await expect.element(menuButton).toHaveFocus();
      await expect
        .element(menuButton)
        .toHaveAttribute("aria-expanded", "false");
    });
    test("Enter key activates the menu item and triggers action, closes the menu and sets focus on the menu button", async ({
      screen,
    }) => {
      const menuButton = screen.getByRole("button");
      const menu = screen.getByRole("menu");

      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");
      await userEvent.keyboard("{Enter}{/Enter}");

      await expect.element(menu).toHaveAttribute("data-menu-open", "false");
      await expect.element(menuButton).toHaveFocus();
    });
    test("Up Arrow key moves focus to the previous menu item and if item is the first, moves focus to last item instead", async ({
      screen,
    }) => {
      const menuitems = screen.getByRole("menuitem");

      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");
      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");
      await expect.element(menuitems.last()).toHaveFocus();
      await expect.element(menuitems.first()).not.toHaveFocus();

      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");
      await expect.element(menuitems.getByText("mango")).toHaveFocus();
    });
    test("Down Arrow key moves visual focus to the next menu item and if item is the last, moves focus to first item instead", async ({
      screen,
    }) => {
      const menuitems = screen.getByRole("menuitem");

      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");
      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");
      await expect.element(menuitems.first()).toHaveFocus();
      await expect.element(menuitems.last()).not.toHaveFocus();

      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");
      await expect.element(menuitems.getByText("blueberry")).toHaveFocus();
    });
    test("Home key moves focus to the first menuitem", async ({ screen }) => {
      const menuitems = screen.getByRole("menuitem");

      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{ArrowUp}{/ArrowUp}");
      await userEvent.keyboard("{Home}{/Home}");
      await expect.element(menuitems.first()).toHaveFocus();
    });
    test("End key moves focus to the last menuitem", async ({ screen }) => {
      const menuitems = screen.getByRole("menuitem");

      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");
      await userEvent.keyboard("{End}{/End}");
      await expect.element(menuitems.last()).toHaveFocus();
    });
    test("Typing character keys moves focus to the next menu item with a label that starts with the typed character if such an menu item exists, otherwise focus does not move", async ({
      screen,
    }) => {
      const menuitems = screen.getByRole("menuitem");

      await userEvent.keyboard("{Tab}{/Tab}");

      await userEvent.keyboard("{ArrowDown}{/ArrowDown}");
      await userEvent.keyboard("o");
      await expect.element(menuitems.getByText("orange")).toHaveFocus();
      await userEvent.keyboard("g");
      await expect.element(menuitems.getByText("gooseberry")).toHaveFocus();
      await userEvent.keyboard("z");
      await expect.element(menuitems.getByText("gooseberry")).toHaveFocus();
    });
  });
});
