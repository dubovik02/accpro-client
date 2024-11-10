import AccComponent from "../AccComponent";

export default class AccButton extends AccComponent {

  /**
   * Надпись на кнопке
   */
  _caption : string;

  constructor(prop : { [key: string]: any }) {
    super(prop);
    this._caption = this._props.caption;
  }

  createDOM() {
    let element = document.createElement('button');
    element.classList.add('button');
    element.textContent = this._caption;
    this._componentDOM = element;
  }

}