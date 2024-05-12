import SubmitPopUp from "../../common/popups/SubmitPopUp";
/**
 * Попап восстановления пароля
 */
 export default class RestorePopUp extends SubmitPopUp {

  /**
   * Элемент инициализации регистрации
   */
  _signUpButton;

  /**
   * Функция инициализации регистрации
  */
  _signUpFunction;


  constructor(prop) {
    super(prop);
    this._signUpFunction = this._props.signUpFunction;
    this._afterCloseDialogFunction = this._props.afterCloseDialogFunction;
  }

  createDOM() {
    super.createDOM();
    this._signUpButton = this._form.querySelector('.popup-restore__signup');
    this._setSignUpListener();
  }

  _getInputsValues() {

    return {
      email: this._form.elements.email.value,
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
    super.close();
  }

}