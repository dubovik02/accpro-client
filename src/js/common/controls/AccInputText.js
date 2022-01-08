import AccComponent from "../AccComponent";

export default class AccInputText extends AccComponent {


  /**
   * Подпись поля
   */
  _labelText;

  /**
   * Тип поля
   */
  _inputType;

  /**
   * Имя поля
   */
  _inputName

  /**
   * Плейсхолдер инпута
   */
  _placeholder;

  /**
   * Строка атрибутов поля
   */
  _attributes = '';


  /**
   * props: labelText, inputType, inputName, placeholder,
   * attributes - иные аттрибуты (required, maxlength, minlength и т.п.)
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this._labelText = this._props.labelText;
    this._inputType = this._props.inputType;
    this._inputName = this._props.inputName;
    this._placeholder = this._props.placeholder;
    this._attributes = this._props.attributes;
  }

  createDOM() {

    this._componentDOM = `<label for="${this.getId()}" class="popup__label">${this._labelText}</label>
                          <input type="${this._inputType}" name="${this._inputName}" id="${this.getId()}" class="input popup__input" placeholder="${this._placeholder}"`
                          +  this._attributes + `>` +
                          `<p class="popup__error-label"></p>`;
  }

}