export class SelectOnlyCombobox extends HTMLElement {
  combobox: HTMLElement | null;
  listboxEl: HTMLUListElement | null | undefined;
  selectActions;
  comboLabel;
  comboEl;
  idBase;
  options;
  activeIndex;
  open;
  searchString;
  searchTimeout: number | undefined;
  ignoreBlur;
  buttonEl;
  comboboxPreviewLabel;

  constructor() {
    super();

    this.combobox = document.querySelector("select-only-combobox");
    this.listboxEl = this.combobox?.querySelector("[role=listbox]");
    this.comboLabel = this.combobox?.querySelector("#combobox-label");
    this.comboEl = this.combobox?.querySelector('[role="combobox"]');
    this.buttonEl = this.combobox?.querySelector("button");
    this.idBase = this.comboEl?.id || "combo";
    this.options = this.combobox?.querySelectorAll("[role=option]");
    this.comboboxPreviewLabel = this.combobox?.querySelector(
      "[data-combobox-preview]",
    );
    // state
    this.activeIndex = 0;
    this.open = false;
    this.searchString = "";
    this.searchTimeout = undefined;
    this.ignoreBlur = false;
    this.selectActions = {
      Close: 0,
      CloseSelect: 1,
      First: 2,
      Last: 3,
      Next: 4,
      Open: 5,
      PageDown: 6,
      PageUp: 7,
      Previous: 8,
      Select: 9,
      Type: 10,
    };
  }

  connectedCallback() {
    // add event listeners
    this.options?.forEach((option, index) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        this.onOptionClick(index);
      });
      option.addEventListener("mousedown", () => this.onOptionMouseDown());
    });
    this.comboLabel?.addEventListener("click", () => this.onLabelClick());
    this.listboxEl?.addEventListener("focusout", (e: FocusEvent) =>
      this.onComboBlur(e),
    );
    this.comboEl?.addEventListener("blur", (e) => this.onComboBlur(e));
    this.comboEl?.addEventListener("click", () => this.onComboClick());
    this.comboEl?.addEventListener("keydown", (e) => this.onComboKeyDown(e));
    document.addEventListener("click", (evt) => {
      if (evt.target instanceof Node && !this.combobox?.contains(evt.target)) {
        this.listboxEl?.classList.add("hidden");
      }
    });
  }

  // filter an array of options against an input string
  // returns an array of options that begin with the filter string, case-independent
  filterOptions(
    options: string[] = [],
    filter: string,
    exclude: string[] = [],
  ) {
    return options.filter((option) => {
      const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0;
      return matches && exclude.indexOf(option) < 0;
    });
  }

  // map a key press to an action
  getActionFromKey(event: KeyboardEvent, menuOpen: boolean) {
    const { key, altKey, ctrlKey, metaKey } = event;
    const openKeys = ["ArrowDown", "ArrowUp", "Enter", " "]; // all keys that will do the default open action
    // handle opening when closed
    if (!menuOpen && openKeys.includes(key)) {
      return this.selectActions.Open;
    }

    // home and end move the selected option when open or closed
    if (key === "Home") {
      return this.selectActions.First;
    }
    if (key === "End") {
      return this.selectActions.Last;
    }

    // handle typing characters when open or closed
    if (
      key === "Backspace" ||
      key === "Clear" ||
      (key.length === 1 && key !== " " && !altKey && !ctrlKey && !metaKey)
    ) {
      return this.selectActions.Type;
    }

    // handle keys when open
    if (menuOpen) {
      if (key === "ArrowUp" && altKey) {
        return this.selectActions.CloseSelect;
      } else if (key === "ArrowDown" && !altKey) {
        return this.selectActions.Next;
      } else if (key === "ArrowUp") {
        return this.selectActions.Previous;
      } else if (key === "PageUp") {
        return this.selectActions.PageUp;
      } else if (key === "PageDown") {
        return this.selectActions.PageDown;
      } else if (key === "Escape") {
        return this.selectActions.Close;
      } else if (key === "Enter" || key === " ") {
        return this.selectActions.CloseSelect;
      }
    }
  }

  // return the index of an option from an array of options, based on a search string
  // if the filter is multiple iterations of the same letter (e.g "aaa"), then cycle through first-letter matches
  getIndexByLetter(options: string[], filter: string, startIndex = 0) {
    const orderedOptions = [
      ...options.slice(startIndex),
      ...options.slice(0, startIndex),
    ];
    const firstMatch = this.filterOptions(orderedOptions, filter)[0];
    const allSameLetter = (array: string[]) =>
      array.every((letter) => letter === array[0]);

    // first check if there is an exact match for the typed string
    if (firstMatch) {
      return options.indexOf(firstMatch);
    }

    // if the same letter is being repeated, cycle through first-letter matches
    else if (allSameLetter(filter.split(""))) {
      const matches = this.filterOptions(orderedOptions, filter[0]);
      return options.indexOf(matches[0]);
    }

    // if no matches, return -1
    else {
      return -1;
    }
  }

  // get an updated option index after performing an action
  getUpdatedIndex(currentIndex: number, maxIndex: number, action: number) {
    const pageSize = 10; // used for pageup/pagedown

    switch (action) {
      case this.selectActions.First:
        return 0;
      case this.selectActions.Last:
        return maxIndex;
      case this.selectActions.Previous:
        return Math.max(0, currentIndex - 1);
      case this.selectActions.Next:
        return Math.min(maxIndex, currentIndex + 1);
      case this.selectActions.PageUp:
        return Math.max(0, currentIndex - pageSize);
      case this.selectActions.PageDown:
        return Math.min(maxIndex, currentIndex + pageSize);
      default:
        return currentIndex;
    }
  }

  // check if element is visible in browser view port
  isElementInView(element: HTMLElement) {
    const bounding = element.getBoundingClientRect();

    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // check if an element is currently scrollable
  isScrollable(element: HTMLElement) {
    return element && element.clientHeight < element.scrollHeight;
  }

  // ensure a given child element is within the parent's visible scroll area
  // if the child is not visible, scroll the parent
  maintainScrollVisibility(
    activeElement: HTMLElement,
    scrollParent: HTMLElement,
  ) {
    const { offsetHeight, offsetTop } = activeElement;
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

    if (isAbove) {
      scrollParent.scrollTo(0, offsetTop);
    } else if (isBelow) {
      scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
  }

  getSearchString(char: string) {
    // reset typing timeout and start new timeout
    // this allows us to make multiple-letter matches, like a native select
    if (typeof this.searchTimeout === "number") {
      window.clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(() => {
      this.searchString = "";
    }, 500);

    // add most recent letter to saved search string
    this.searchString += char;
    return this.searchString;
  }

  onLabelClick() {
    if (this.comboEl instanceof HTMLElement) this.comboEl?.focus();
  }

  onComboBlur(event: Event) {
    // do nothing if relatedTarget is contained within listboxEl
    if (
      event instanceof FocusEvent &&
      event.relatedTarget instanceof Node &&
      this.listboxEl?.contains(event.relatedTarget)
    ) {
      return;
    }

    // select current option and close
    if (this.open) {
      this.selectOption(this.activeIndex);
      this.updateMenuState(false, false);
    }
  }

  onComboClick() {
    this.updateMenuState(!this.open, false);
  }

  onComboKeyDown(event: Event) {
    if (this.options && event instanceof KeyboardEvent) {
      const { key } = event;

      const max = this.options?.length - 1;

      const action = this.getActionFromKey(event, this.open);

      switch (action) {
        case this.selectActions.Last:
        case this.selectActions.First:
          this.updateMenuState(true);
        // intentional fallthrough
        case this.selectActions.Next:
        case this.selectActions.Previous:
        case this.selectActions.PageUp:
        case this.selectActions.PageDown:
          event.preventDefault();
          return this.onOptionChange(
            this.getUpdatedIndex(this.activeIndex, max, action),
          );
        case this.selectActions.CloseSelect:
          event.preventDefault();
          this.selectOption(this.activeIndex);
        // intentional fallthrough
        case this.selectActions.Close:
          event.preventDefault();
          return this.updateMenuState(false);
        case this.selectActions.Type:
          return this.onComboType(key);
        case this.selectActions.Open:
          event.preventDefault();
          return this.updateMenuState(true);
      }
    }
  }

  onComboType(letter: string) {
    // open the listbox if it is closed
    this.updateMenuState(true);

    // find the index of the first matching option
    const searchString = this.getSearchString(letter);
    if (this.options) {
      const optionsContentArray = Array.from(this.options).map(
        (option) => option.textContent,
      );
      const searchIndex = this.getIndexByLetter(
        optionsContentArray,
        searchString,
        this.activeIndex + 1,
      );

      // if a match was found, go to it
      if (searchIndex >= 0) {
        this.onOptionChange(searchIndex);
      }
      // if no matches, clear the timeout and search string
      else {
        window.clearTimeout(this.searchTimeout);
        this.searchString = "";
      }
    }
  }

  onOptionChange(index: number) {
    // update state
    this.activeIndex = index;

    // update aria-activedescendant
    this.comboEl?.setAttribute(
      "aria-activedescendant",
      `${this.idBase}-${index}`,
    );

    // update active option styles
    if (this.options) {
      const options = Array.from(this.options);
      const option = options[index];
      [...options].forEach((optionEl) => {
        optionEl.classList.remove("option-current");
      });
      option.classList.add("option-current");

      // ensure the new option is in view
      if (
        this.listboxEl &&
        this.isScrollable(this.listboxEl) &&
        option instanceof HTMLElement
      ) {
        this.maintainScrollVisibility(option, this.listboxEl);
      }

      // ensure the new option is visible on screen
      // ensure the new option is in view
      if (option instanceof HTMLElement && !this.isElementInView(option)) {
        option.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }

  onOptionClick(index: number) {
    this.onOptionChange(index);
    this.selectOption(index);
    this.updateMenuState(false);
  }

  onOptionMouseDown() {
    // Clicking an option will cause a blur event,
    // but we don't want to perform the default keyboard blur action
    this.ignoreBlur = true;
  }

  selectOption(index: number) {
    // update state
    if (this.options) {
      this.activeIndex = index;

      // update displayed value
      const optionsContentArray = Array.from(this.options).map(
        (option) => option.textContent,
      );
      const selected = optionsContentArray[index];
      if (this.comboboxPreviewLabel) {
        this.comboboxPreviewLabel.innerHTML = selected;
      }

      // update aria-selected
      const options = Array.from(this.options);
      [...options].forEach((optionEl) => {
        optionEl.setAttribute("aria-selected", "false");
      });
      options[index].setAttribute("aria-selected", "true");
    }
  }

  updateMenuState(open: boolean, callFocus = true) {
    if (this.open === open) {
      return;
    }

    // update state
    this.open = open;

    // update aria-expanded and styles
    this.comboEl?.setAttribute("aria-expanded", `${open}`);
    if (open) {
      this.combobox?.setAttribute("data-open", "true");
    } else {
      this.combobox?.removeAttribute("data-open");
    }

    // update activedescendant
    const activeID = open ? `${this.idBase}-${this.activeIndex}` : "";
    this.comboEl?.setAttribute("aria-activedescendant", activeID);

    if (
      activeID === "" &&
      this.comboEl instanceof HTMLElement &&
      !this.isElementInView(this.comboEl)
    ) {
      this.comboEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // move focus back to the combobox, if needed
    if (callFocus && this.comboEl instanceof HTMLElement) {
      this.comboEl?.focus();
    }
  }
}
