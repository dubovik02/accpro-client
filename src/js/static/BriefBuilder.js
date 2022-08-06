import AccComponent from "../common/AccComponent";
import issueIco from '../../images/issue256.png';
import ideaIco from '../../images/idea256.png';
import solutionIco from '../../images/solution256.png';
import shareIco from '../../images/paper-plane256.png';

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
                        <h1 class="brief__title">Открытая библиотека бухгалтерских проводок</h1>
                        <p class="brief__text">Находите, предлагайте, делитесь</p>
                        <div class="search-section__container">
                          <input class="input search-section__input-search" placeholder="Объекты учета, содержание операции или проводок..."></>
                          <button class="button search-section__button-search">Найти</button>
                        </div>
                        <!--<button class="button brief__button-registration">Регистрация</button>-->
                      </div>

                      <!--<div class="info-section">
                        <p class="info-section__title">Открытая библиотека решений</p>
                        <div class="info-section__card-container">
                          <div class="info-card">
                            <img class="info-card__icon" src="${issueIco}" alt="вопрос">
                            <p class="info-card__title">Дебет или кредит?</p>
                          </div>
                          <div class="info-card">
                            <img class="info-card__icon" src="${ideaIco}" alt="идея">
                            <p class="info-card__title">Есть идея!</p>
                          </div>
                          <div class="info-card">
                            <img class="info-card__icon" src="${solutionIco}" alt="решение">
                            <p class="info-card__title">Решаем!</p>
                          </div>
                          <div class="info-card">
                            <img class="info-card__icon" src="${shareIco}" alt="поделиться">
                            <p class="info-card__title">Делимся!</p>
                          </div>
                        </div>
                      </div>-->

                      <!--<div class="search-section">
                        <div class="search-section__container">
                          <input class="input search-section__input-search" placeholder="Объекты учета, содержание операции или проводок..."></>
                          <button class="button search-section__button-search">Найти</button>
                        </div>
                      </div>-->`;

    this._componentDOM.insertAdjacentHTML('afterbegin', briefHtml);
    this._buttonSignUp = this._componentDOM.querySelector('.brief__button-registration');
    this._setListeners();
  }

  getButtonSignUp() {
    return this._buttonSignUp;
  }

  /**<p class="brief__text">Найдите решения здесь, делитесь с коллегами, предлагайте свои!</p>**/

}