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
   * Функция инициализации восстановления пароля
   */
   _restoreFunction;

  /**
   * Элемент инициализации регистрации
   */
  _signUpButton;

  /**
   * Элемент инициации восстановления пароля
   */
  _restoreButton;

  constructor(prop) {
    super(prop);
    this._signUpFunction = this._props.signUpFunction;
    this._restoreFunction = this._props.restoreFunction;
  }

  createDOM() {
    super.createDOM();
    this._signUpButton = this._form.querySelector('.popup-signin__signup');
    this._restoreButton = this._form.querySelector('.popup-signin__restore');
    this._setSignUpListener();
    this._setRestoreListener();
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

  _setRestoreListener() {
    if (this._restoreFunction instanceof Function) {
      this._restoreButton.addEventListener('click', this._restore);
    }
  }

  _signUp = () => {
    this.close();
    this._signUpFunction.call(this, []);
  }

  _restore = () => {
    this.close();
    this._restoreFunction.call(this, []);
  }

  close() {
    if (this._signUpButton instanceof Element) {
      this._signUpButton.removeEventListener('click', this._signUp);
    }
    if (this._restoreButton instanceof Element) {
      this._restoreButton.removeEventListener('click', this._restore);
    }
    super.close();
  }

}