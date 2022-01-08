import SubmitPopUp from "../../common/popups/SubmitPopUp";

/**
 * Попап входа в систему
 */
export default class SignInPopUp extends SubmitPopUp {

  /**
   * Функция инициализации регистрации
   */
  _signUpFunction;
  /**
   * Элемент инициализации регистрации
   */
  _signUpButton;

  constructor(prop) {
    super(prop);
    this._signUpFunction = this._props.signUpFunction;
  }

  createDOM() {
    super.createDOM();
    this._signUpButton = this._form.querySelector('.popup__link');
    this._setSignUpListener();
  }

  _getInputsValues() {

    return {
      userPass: this._form.elements.password.value,
      userEmail: this._form.elements.email.value,
    }

  }

  _setSignUpListener() {
    if (this._signUpFunction instanceof Function) {
      this._signUpButton.addEventListener('click', this._signUp);
    }
  }

  _signUp = () => {
    this.close();
    this._signUpFunction.call(this, []);
  }

  close() {
    if (this._signUpButton instanceof Element) {
      this._signUpButton.removeEventListener('click', this._signUp);
    }
    super.close();
  }

}