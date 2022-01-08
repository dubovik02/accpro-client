import AccComponent from "../common/AccComponent";

export default class BriefBuilder extends AccComponent {

  /**
   * Конпка регистрации
   */
  _buttonSignUp;

  /**
   * Коллбэк для функии регистрации
   */
  _signUpFunction;


  constructor(prop) {
    super(prop);
    this._signUpFunction = this._props.signUpFunction;
  }

  _setListeners() {
    if (this._buttonSignUp instanceof Element) {
      this._buttonSignUp.addEventListener('click', () => {
        if (this._signUpFunction instanceof Function) {
          this._signUpFunction.call(this, []);
        }
      })
    }
  }

  createDOM() {
    this._componentDOM = document.createElement('section');
    this._componentDOM.classList.add('brief-section');

    const briefHtml = `<div class="brief">
                        <h1 class="brief__title">Online-сервисы для бухгалтеров бюджетной сферы</h1>
                        <h2 class="brief__subtitle">Простые решения сложных задач</h2>
                        <p class="brief__text">Найдите решения здесь, делитесь с коллегами, предлагайте свои!</p>
                        <button class="button brief__button-registration">Регистрация</button>
                      </div>`;
    this._componentDOM.insertAdjacentHTML('afterbegin', briefHtml);
    this._buttonSignUp = this._componentDOM.querySelector('.brief__button-registration');
    this._setListeners();
  }

  getButtonSignUp() {
    return this._buttonSignUp;
  }

  /**<p class="brief__text">Найдите решения здесь, делитесь с коллегами, предлагайте свои!</p>**/

}