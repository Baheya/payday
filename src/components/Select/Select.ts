import { SelectOnlyCombobox } from "#components/SelectOnlyCombobox/SelectOnlyCombobox.ts";
import { FaceMixin } from "#lib/FaceMixin.ts";

export class Select extends FaceMixin(SelectOnlyCombobox) {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this._internals.setFormValue(
      this.options[this.activeIndex].getAttribute("data-option-value"),
    );

    this.addEventListener("selection-change", () => {
      this._internals.setFormValue(
        this.options[this.activeIndex].getAttribute("data-option-value"),
      );
    });
  }
}
