export class Menu extends HTMLElement {
  buttonNode;
  menuNode;
  currentMenuitem: HTMLButtonElement | null;
  menuitemNodes: HTMLButtonElement[];
  firstMenuitem: HTMLButtonElement | null;
  lastMenuitem: HTMLButtonElement | null;
  firstChars: string[];
  _performMenuAction!: (tgt: HTMLButtonElement) => void;

  constructor() {
    super();

    this.buttonNode = this.querySelector<HTMLButtonElement>("[aria-haspopup]");
    this.menuNode = this.querySelector('[role="menu"]');
    this.currentMenuitem = null;
    this.menuitemNodes = [];
    this.firstMenuitem = null;
    this.lastMenuitem = null;
    this.firstChars = [];
  }

  connectedCallback() {
    this.buttonNode?.addEventListener("keydown", (e) =>
      this.onButtonKeydown(e),
    );
    this.buttonNode?.addEventListener("click", (e) => this.onButtonClick(e));
    const nodes = this.querySelectorAll('[role="menuitem"]');

    for (let i = 0; i < nodes.length; i++) {
      const menuitem = nodes[i];
      if (menuitem instanceof HTMLButtonElement) {
        this.menuitemNodes.push(menuitem);
        menuitem.tabIndex = -1;
        this.firstChars.push(menuitem.textContent.trim()[0].toLowerCase());

        menuitem.addEventListener("click", (e) => this.onMenuitemClick(e));

        menuitem.addEventListener("mouseover", (e) =>
          this.onMenuitemMouseover(e),
        );

        menuitem.addEventListener("keydown", (e) => this.onMenuitemKeydown(e));

        if (!this.firstMenuitem) {
          this.firstMenuitem = menuitem;
        }
        this.lastMenuitem = menuitem;
      }
    }

    this.addEventListener("focusin", () => this.onFocusin());
    this.addEventListener("focusout", () => this.onFocusout());

    window.addEventListener(
      "mousedown",
      (e) => this.onBackgroundMousedown(e),
      true,
    );
  }

  setFocusToMenuitem(newMenuitem: HTMLButtonElement | null) {
    this.menuitemNodes.forEach((item) => {
      if (item === newMenuitem) {
        item.tabIndex = 0;
        newMenuitem.focus();
      } else {
        item.tabIndex = -1;
      }
    });
  }

  setFocusToFirstMenuitem() {
    this.setFocusToMenuitem(this.firstMenuitem);
  }

  setFocusToLastMenuitem() {
    this.setFocusToMenuitem(this.lastMenuitem);
  }

  setFocusToPreviousMenuitem(currentMenuitem: HTMLButtonElement) {
    let newMenuitem: HTMLButtonElement | null;
    let index;

    if (currentMenuitem === this.firstMenuitem) {
      newMenuitem = this.lastMenuitem;
    } else {
      index = this.menuitemNodes.indexOf(currentMenuitem);
      newMenuitem = this.menuitemNodes[index - 1];
    }

    this.setFocusToMenuitem(newMenuitem);

    return newMenuitem;
  }

  setFocusToNextMenuitem(currentMenuitem: HTMLButtonElement) {
    let newMenuitem: HTMLButtonElement | null;
    let index;

    if (currentMenuitem === this.lastMenuitem) {
      newMenuitem = this.firstMenuitem;
    } else {
      index = this.menuitemNodes.indexOf(currentMenuitem);
      newMenuitem = this.menuitemNodes[index + 1];
    }
    this.setFocusToMenuitem(newMenuitem);

    return newMenuitem;
  }

  setFocusByFirstCharacter(currentMenuitem: HTMLButtonElement, char: string) {
    let start;
    let index;

    if (char.length > 1) {
      return;
    }

    char = char.toLowerCase();

    // Get start index for search based on position of currentItem
    start = this.menuitemNodes.indexOf(currentMenuitem) + 1;
    if (start >= this.menuitemNodes.length) {
      start = 0;
    }

    // Check remaining slots in the menu
    index = this.firstChars.indexOf(char, start);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = this.firstChars.indexOf(char, 0);
    }

    // If match was found...
    if (index > -1) {
      this.setFocusToMenuitem(this.menuitemNodes[index]);
    }
  }

  // Utilities

  getIndexFirstChars(startIndex: number, char: string) {
    for (let i = startIndex; i < this.firstChars.length; i++) {
      if (char === this.firstChars[i]) {
        return i;
      }
    }
    return -1;
  }

  // Popup menu methods

  openPopup() {
    if (this.menuNode instanceof HTMLElement) {
      this.menuNode?.setAttribute("data-menu-open", "true");
      this.buttonNode?.setAttribute("aria-expanded", "true");
      // this.menuNode?.focus();
      // this.setFocusToFirstMenuitem();
    }
  }

  closePopup() {
    if (this.isOpen()) {
      this.buttonNode?.setAttribute("aria-expanded", "false");
      // this.menuNode?.setAttribute("aria-activedescendant", "");
      // for (let i = 0; i < this.menuitemNodes.length; i++) {
      //   this.menuitemNodes[i].removeAttribute("data-menuitem-focus");
      // }
      this.menuNode?.setAttribute("data-menu-open", "false");
      // this.buttonNode?.focus();
    }
  }

  isOpen() {
    return this.buttonNode?.getAttribute("aria-expanded") === "true";
  }

  // Menu event handlers

  onFocusin() {
    this.classList.add("focus");
    console.log(document.activeElement);
  }

  onFocusout() {
    this.classList.remove("focus");
  }

  onButtonKeydown(event: KeyboardEvent) {
    const key = event.key;
    let flag = false;

    switch (key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "Down":
        this.openPopup();
        this.setFocusToFirstMenuitem();
        flag = true;
        break;

      case "Esc":
      case "Escape":
        this.closePopup();
        flag = true;
        break;

      case "Up":
      case "ArrowUp":
        this.openPopup();
        this.setFocusToLastMenuitem();
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onButtonClick(event: Event) {
    if (this.isOpen()) {
      this.closePopup();
      this.buttonNode?.focus();
    } else {
      this.openPopup();
      this.setFocusToFirstMenuitem();
    }
    event.stopPropagation();
    event.preventDefault();
  }

  onMenuitemKeydown(event: Event) {
    const target = event.currentTarget;
    if (
      event instanceof KeyboardEvent &&
      target &&
      target instanceof HTMLButtonElement
    ) {
      const key = event.key;
      let flag = false;

      function isPrintableCharacter(str: string) {
        return str.length === 1 && str.match(/\S/);
      }

      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.shiftKey) {
        if (isPrintableCharacter(key)) {
          this.setFocusByFirstCharacter(target, key);
          flag = true;
        }

        if (event.key === "Tab") {
          this.closePopup();
          flag = true;
        }
      } else {
        switch (key) {
          case " ":
          case "Enter":
            if (this._performMenuAction && target) {
              this._performMenuAction(target);
              flag = true;
            }
            break;

          case "Esc":
          case "Escape":
            this.closePopup();
            this.buttonNode?.focus();
            flag = true;
            break;

          case "Up":
          case "ArrowUp":
            this.setFocusToPreviousMenuitem(target);
            flag = true;
            break;

          case "ArrowDown":
          case "Down":
            this.setFocusToNextMenuitem(target);
            flag = true;
            break;

          case "Home":
          case "PageUp":
            this.setFocusToFirstMenuitem();
            flag = true;
            break;

          case "End":
          case "PageDown":
            this.setFocusToLastMenuitem();
            flag = true;
            break;

          case "Tab":
            this.closePopup();
            break;

          default:
            if (isPrintableCharacter(key)) {
              this.setFocusByFirstCharacter(target, key);
              flag = true;
            }
            break;
        }
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  onMenuitemMouseover(event: Event) {
    const tgt = event.currentTarget;
    if (tgt instanceof HTMLButtonElement) {
      tgt.focus();
    }
  }

  onMenuitemClick(event: Event) {
    const tgt = event.currentTarget;
    if (tgt instanceof HTMLButtonElement) {
      this.closePopup();
      this.buttonNode?.focus();
      if (this._performMenuAction) this._performMenuAction(tgt);
    }
  }

  onBackgroundMousedown(event: Event) {
    if (event.target instanceof HTMLElement && !this.contains(event.target)) {
      if (this.isOpen()) {
        this.closePopup();
        this.buttonNode?.focus();
      }
    }
  }

  set performMenuAction(fn: (tgt: HTMLButtonElement | null) => void) {
    this._performMenuAction = fn;
  }
}
