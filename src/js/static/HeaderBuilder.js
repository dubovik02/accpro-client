import AccComponent from '../common/AccComponent';
import logo from '../../images/logo.png';
//import signInIco from '../../images/sign-in.png';

/**
 * Класс формирования заголовка
 */

export default class HeaderBuilder extends AccComponent {

  /**
   * Кнопка входа/логаута
   */
  _controlButton;

  /**
   * Коллбэк логина
   */
  //_loginFunction = null;

  /**
   * Коллбэк логаута
   */
  //_logoutFunction = null;

  constructor(props) {
    super(props);
  }

  /**
   * Устанавливает обработчик на кнопку логина
   * @param {Function} loginFunction коллбэк для нажатия кнопки логина
   */
  // setLoginAction(loginFunction) {
  //   this._loginFunction = loginFunction;
  // }

  // setLogoutAction(logoutFunction) {
  //   this._logoutFunction = logoutFunction;
  // }


  /**
   * Устанавливает обработчики для элементов
   */
  // _setListeners(isButLogin) {
  //   if (this._controlButton instanceof Element && isButLogin) {
  //     this._controlButton.addEventListener('click', () => {
  //       this._loginFunction.call(this, []);
  //     });
  //   }
  //   else {
  //     this._controlButton.addEventListener('click', () => {
  //       this._logoutFunction.call(this, []);
  //     });
  //   }
  // }

  /**
   * Формирует DOM заголовка
   */
  createDOM() {

      this._componentDOM = document.createElement('section');
      this._componentDOM.classList.add('header');

      const headerHtml = `<a class="link header__link" href="./index.html">
                            <img class="logo logo_place_header" src="${logo}" alt="логотип"></img>
                          </a>
                          <menu class="menu">
                            <ul class="menu-list">
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Новости</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Первичка и регистры</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Учет</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Отчетность</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Справочники</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Библиотека</a></li>
                            </ul>
                          </menu>`;

      this._componentDOM.insertAdjacentHTML('afterbegin', headerHtml);

      this._createButton(this._props.isButLogin);
      //this._setListeners(this._props.isButLogin);

      this._componentDOM.appendChild(this._controlButton);
  }

  /**
   * Создает базовую кнопку и настраивает ее
   */
  _createButton(isButLogin) {
    this._controlButton = document.createElement('button');
    this._controlButton.classList.add('button');
    this._controlButton.classList.add('header__button-login');
    this._controlButton.textContent = (isButLogin ? 'Войти' : `${localStorage.getItem('username')} выйти?`);

    //button.insertAdjacentHTML('afterbegin', `<span>${caption}</span>`);
    //button.insertAdjacentHTML('afterbegin', `<img src="${ico}"></img>`);
  }

  getControlButton() {
    return this._controlButton;
  }

}