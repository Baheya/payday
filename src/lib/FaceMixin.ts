/* eslint-disable @typescript-eslint/no-explicit-any */
export declare class FaceMixinInterface {
  static readonly formAssociated: boolean;
  protected _internals: ElementInternals;
  name: string;
  readonly form: HTMLFormElement | null;
  readonly validity: ValidityState;
  readonly validationMessage: string;
  readonly willValidate: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  formDisabledCallback(disabled: boolean): void;
  formResetCallback(): void;
}

type Constructor<T = object> = new (...args: any[]) => T;

export const FaceMixin = <T extends Constructor<HTMLElement>>(
  superClass: T,
) => {
  class FaceElement extends superClass {
    static readonly formAssociated = true;
    protected _internals: ElementInternals;

    constructor(...args: any[]) {
      super(...args);
      this._internals = this.attachInternals();
    }

    get form() {
      return this._internals.form;
    }
    get name() {
      return this.getAttribute("name");
    }
    get type() {
      return this.localName;
    }
    get validity() {
      return this._internals.validity;
    }
    get validationMessage() {
      return this._internals.validationMessage;
    }
    get willValidate() {
      return this._internals.willValidate;
    }

    checkValidity() {
      return this._internals.checkValidity();
    }
    reportValidity() {
      return this._internals.reportValidity();
    }

    formDisabledCallback(disabled: boolean) {
      (this as any).disabled = disabled;
    }

    formResetCallback() {
      /* Subclasses override this */
    }
  }
  // This cast merges the blueprint with the original class
  return FaceElement as unknown as Constructor<FaceMixinInterface> & T;
};
