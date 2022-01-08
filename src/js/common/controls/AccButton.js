import AccComponent from "../AccComponent";

export default class AccButton extends AccComponent {

  /**
   * Надпись на кнопке
   */
  _caption;

  constructor(prop) {
    super(prop);
    this._caption = this._props.caption;
  }

  createDOM() {
    this._componentDOM = `<button type="button" class="button">${this._caption}</button>`;
  }

}