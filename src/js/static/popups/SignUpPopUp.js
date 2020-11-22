import SubmitPopUp from "../../common/popups/SubmitPopUp";

export default class SignUpPopUp extends SubmitPopUp {

  /**
   * Функция инициализации входа
   */
  _signInFunction;
  /**
   * Элемент инициализации входа
   */
  _signInButton;

  constructor(prop) {
    super(prop);
    this._signInFunction = this._props.signInFunction;
  }

  createDOM() {
    super.createDOM();
    this._signInButton = this._form.querySelector('.popup__link');
    this._setSignInListener();
  }

  _getInputsValues() {

    return {
      userName: this._form.elements.name.value,
      userPass: this._form.elements.password.value,
      userEmail: this._form.elements.email.value,
    }

  }

  _setSignInListener() {
    if (this._signInFunction instanceof Function) {
      this._signInButton.addEventListener('click', this._signIn);
    }
  }

  _signIn = () => {
    this.close();
    this._signInFunction.call(this, []);
  }

  close() {
    if (this._signInButton instanceof Element) {
      this._signInButton.removeEventListener('click', this._signIn);
    }
    super.close();
  }

}