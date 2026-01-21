export class SingleSelect extends HTMLElement {
  singleSelect: HTMLElement | null;
  listboxNode: HTMLUListElement | null | undefined;
  singleSelectTrigger;
  activeDescendant;
  startRangeIndex: number | null;
  keysSoFar;

  constructor() {
    super();

    this.singleSelect = document.querySelector("single-select");
    this.listboxNode = this.singleSelect?.querySelector("ul");
    this.singleSelectTrigger = this.singleSelect?.querySelector("button");
    this.activeDescendant = this.listboxNode?.getAttribute(
      "aria-this.activeDescendant",
    );
    this.startRangeIndex = 0;
    this.keysSoFar = "";
  }

  connectedCallback() {
    this.registerEvents();
  }

  checkClickItem = (evt: MouseEvent) => {
    if (evt.target && evt.target instanceof HTMLElement) {
      if (evt.target.getAttribute("role") !== "option") {
        return;
      }

      this.focusItem(evt.target);
      this.updateScroll();
    }
  };

  registerEvents = () => {
    this.listboxNode?.addEventListener("focus", () => this.setupFocus());
    this.listboxNode?.addEventListener("keydown", (evt) =>
      this.checkKeyPress(evt),
    );
    this.listboxNode?.addEventListener("click", (evt) =>
      this.checkClickItem(evt),
    );
    document.addEventListener("click", (evt) => {
      if (
        evt.target instanceof Node &&
        !this.singleSelect?.contains(evt.target)
      ) {
        this.listboxNode?.classList.add("hidden");
      }
    });
    this.singleSelectTrigger?.addEventListener("click", () => {
      this.listboxNode?.classList.toggle("hidden");
    });
  };

  setupFocus = () => {
    if (this.activeDescendant) {
      const listitem = document.getElementById(this.activeDescendant);
      listitem?.scrollIntoView({ block: "nearest", inline: "nearest" });
    } else {
      this.focusFirstItem();
    }
  };

  focusFirstItem = () => {
    const firstItem = this.listboxNode?.querySelector('[role="option"]');

    if (firstItem && firstItem instanceof HTMLElement) {
      this.focusItem(firstItem);
    }
  };

  focusLastItem = () => {
    const itemList = this.listboxNode?.querySelectorAll('[role="option"]');

    if (itemList?.length) {
      this.focusItem(itemList[itemList.length - 1]);
    }
  };

  findItemToFocus = (character: string) => {
    const itemList = this.listboxNode?.querySelectorAll('[role="option"]');
    let searchIndex = 0;
    if (itemList?.length) {
      if (!this.keysSoFar) {
        for (let i = 0; i < itemList.length; i++) {
          if (itemList[i].getAttribute("id") === this.activeDescendant) {
            searchIndex = i;
          }
        }
      }

      this.keysSoFar += character;
      this.clearKeysSoFarAfterDelay();

      let nextMatch = this.findMatchInRange(
        itemList,
        searchIndex + 1,
        itemList?.length,
      );

      if (!nextMatch) {
        nextMatch = this.findMatchInRange(itemList, 0, searchIndex);
      }
      return nextMatch;
    }
  };

  getElementIndex = (option: Element, options: NodeList) => {
    const allOptions = Array.prototype.slice.call(options); // convert to array
    const optionIndex = allOptions.indexOf(option);

    return typeof optionIndex === "number" ? optionIndex : null;
  };

  findNextOption = (currentOption: Element) => {
    const allOptions = Array.prototype.slice.call(
      this.listboxNode?.querySelectorAll('[role="option"]'),
    ); // get options array
    const currentOptionIndex = allOptions.indexOf(currentOption);
    let nextOption = null;

    if (currentOptionIndex > -1 && currentOptionIndex < allOptions.length - 1) {
      nextOption = allOptions[currentOptionIndex + 1];
    }

    return nextOption;
  };

  findPreviousOption = (currentOption: Element) => {
    const allOptions = Array.prototype.slice.call(
      this.listboxNode?.querySelectorAll('[role="option"]'),
    ); // get options array
    const currentOptionIndex = allOptions.indexOf(currentOption);
    let previousOption = null;

    if (currentOptionIndex > -1 && currentOptionIndex > 0) {
      previousOption = allOptions[currentOptionIndex - 1];
    }

    return previousOption;
  };

  clearKeysSoFarAfterDelay = () => {
    let keyClear;
    if (keyClear) {
      clearTimeout(keyClear);
      keyClear = null;
    }
    keyClear = setTimeout(() => {
      this.keysSoFar = "";
      keyClear = null;
    }, 500);
  };

  findMatchInRange = (
    list: NodeListOf<Element>,
    startIndex: number,
    endIndex: number,
  ) => {
    // Find the first item starting with the keysSoFar substring, searching in
    // the specified range of items
    for (let n = startIndex; n < endIndex; n++) {
      const labelElement = list[n];
      if (labelElement instanceof HTMLElement) {
        const label = labelElement.innerText;
        if (label && label.toLowerCase().indexOf(this.keysSoFar) === 0) {
          return labelElement;
        }
      }
    }
    return null;
  };

  defocusItem = (element?: HTMLElement | null) => {
    if (!element) {
      return;
    }

    element.removeAttribute("aria-selected");
    element.classList.remove("focused");
  };

  focusItem = (element: Element | null) => {
    if (this.activeDescendant) {
      const activeDescendantElement = document.getElementById(
        this.activeDescendant,
      );
      this.defocusItem(activeDescendantElement);
    }
    element?.setAttribute("aria-selected", "true");
    element?.classList.add("focused");
    if (element) {
      this.listboxNode?.setAttribute("aria-this.activeDescendant", element.id);
      this.activeDescendant = element.id;

      // checkUpDownButtons();
      // handleFocusChange(element);
    }
  };

  checkInRange = (index: number, start: number, end: number) => {
    const rangeStart = start < end ? start : end;
    const rangeEnd = start < end ? end : start;

    return index >= rangeStart && index <= rangeEnd;
  };

  selectRange = (start: number, end: number | HTMLElement) => {
    // get start/end indices
    const allOptions = this.listboxNode?.querySelectorAll('[role="option"]');
    if (allOptions?.length) {
      const startIndex =
        typeof start === "number"
          ? start
          : this.getElementIndex(start, allOptions);
      const endIndex =
        typeof end === "number" ? end : this.getElementIndex(end, allOptions);
      if (allOptions?.length && startIndex && endIndex) {
        for (let index = 0; index < allOptions.length; index++) {
          const selected = this.checkInRange(index, startIndex, endIndex);
          allOptions[index].setAttribute("aria-selected", selected + "");
        }
      }
    }
  };

  updateScroll = () => {
    if (this.activeDescendant) {
      const selectedOption = document.getElementById(this.activeDescendant);
      if (selectedOption && this.listboxNode) {
        const scrollBottom =
          this.listboxNode.clientHeight + this.listboxNode.scrollTop;
        const elementBottom =
          selectedOption.offsetTop + selectedOption.offsetHeight;
        if (elementBottom > scrollBottom) {
          this.listboxNode.scrollTop =
            elementBottom - this.listboxNode.clientHeight;
        } else if (selectedOption.offsetTop < this.listboxNode.scrollTop) {
          this.listboxNode.scrollTop = selectedOption.offsetTop;
        }
        selectedOption.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }
  };

  checkKeyPress = (evt: KeyboardEvent) => {
    const lastActiveId = this.activeDescendant;
    const allOptions = this.listboxNode?.querySelectorAll('[role="option"]');
    let currentItem: Element | null | undefined;
    if (this.activeDescendant) {
      currentItem = document.getElementById(this.activeDescendant);
    } else {
      currentItem = allOptions?.[0];
    }
    let nextItem = currentItem;

    if (!currentItem) {
      return;
    }

    switch (evt.key) {
      case "PageUp":
      case "PageDown":
        evt.preventDefault();

        break;
      case "ArrowUp":
      case "ArrowDown":
        evt.preventDefault();
        if (!this.activeDescendant && currentItem) {
          // focus first option if no option was previously focused, and perform no other actions
          this.focusItem(currentItem);
          break;
        }

        if (evt.key === "ArrowUp") {
          nextItem = this.findPreviousOption(currentItem);
        } else {
          nextItem = this.findNextOption(currentItem);
        }

        if (
          nextItem &&
          evt.shiftKey &&
          this.startRangeIndex &&
          nextItem instanceof HTMLElement
        ) {
          this.selectRange(this.startRangeIndex, nextItem);
        }

        if (nextItem && nextItem instanceof HTMLElement) {
          this.focusItem(nextItem);
        }

        break;

      case "Home":
        evt.preventDefault();
        this.focusFirstItem();
        break;

      case "End":
        evt.preventDefault();
        this.focusLastItem();

        if (
          evt.shiftKey &&
          evt.ctrlKey &&
          allOptions?.length &&
          this.startRangeIndex
        ) {
          this.selectRange(this.startRangeIndex, allOptions.length - 1);
        }
        break;

      case "Shift":
        if (allOptions?.length) {
          this.startRangeIndex = this.getElementIndex(currentItem, allOptions);
        }
        break;

      case " ":
        if (nextItem) {
          evt.preventDefault();
        }
        break;

      case "Backspace":
      case "Delete":
      case "Enter": {
        evt.preventDefault();

        let nextUnselected = nextItem?.nextElementSibling;
        while (nextUnselected) {
          if (nextUnselected.getAttribute("aria-selected") != "true") {
            break;
          }
          nextUnselected = nextUnselected.nextElementSibling;
        }
        if (!nextUnselected) {
          nextUnselected = nextItem?.previousElementSibling;
          while (nextUnselected) {
            if (nextUnselected.getAttribute("aria-selected") != "true") {
              break;
            }
            nextUnselected = nextUnselected.previousElementSibling;
          }
        }

        if (
          !this.activeDescendant &&
          nextUnselected &&
          nextUnselected instanceof HTMLElement
        ) {
          this.focusItem(nextUnselected);
        }
        break;
      }

      case "A":
      case "a":
        // handle control + A
        if (evt.ctrlKey || evt.metaKey) {
          evt.preventDefault();
          break;
        }
      // fall through
      default:
        if (evt.key.length === 1) {
          const itemToFocus = this.findItemToFocus(evt.key.toLowerCase());
          if (itemToFocus) {
            this.focusItem(itemToFocus);
          }
        }
        break;
    }

    if (this.activeDescendant !== lastActiveId) {
      this.updateScroll();
    }
  };
}
