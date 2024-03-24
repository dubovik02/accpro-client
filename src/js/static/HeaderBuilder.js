import AccComponent from '../common/AccComponent';
import logo from '../../images/logo.png';
import signInIco from '../../images/sign-in.png';
import logoutIco from '../../images/logout.png';
import langIco from '../../images/world24.png';
import Properties from '../properties/Properties';

/**
 * Класс формирования заголовка
 */

export default class HeaderBuilder extends AccComponent {

  /**
   * Кнопка входа/логаута
   */
  _buttonLogin;

  /**
   * Выбор языка
   */
   _buttonLang;

  //Мменю "Главная"
  _menuItemMain;

  /**
   * Меню "Новости"
   */
  _menuItemSearch;

  /**
   * Меню "Песочница"
   */
  _menuItemSandBox;

  /**
   * Набор пунктов меню
   */
  _menuItemsList = [];

  /**
   * набор экшенов для пунктов меню
   */
  _menuActions;

  constructor(props) {
    super(props);
    this._menuActions = this._props.menuActions;
  }

  /**
   * Формирует DOM заголовка
   */
  createDOM() {

      this._componentDOM = document.createElement('section');
      this._componentDOM.classList.add('header');

      const headerHtml = `<img class="logo logo_place_header" src="${logo}" alt="логотип"></img>
                          <menu class="menu">
                            <ul class="menu-list">
                            <li class="menu-list__item"><a class="link menu-link menu-link_font_bold menu-item-main">${Properties.lang.dict.header.mainTitle}</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold menu-item-search">${Properties.lang.dict.header.searchTitle}</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold menu-item-sandbox">${Properties.lang.dict.header.sandBoxTitle}</a></li>
                            </ul>
                          </menu>`;

      this._componentDOM.insertAdjacentHTML('afterbegin', headerHtml);

      this._createMenuItems();
      this._setMenuItemsListeners();
      this._createLoginButton(this._props.isButLogin);
      this._createLangButton();

      let buttonContainer = document.createElement('div');
      buttonContainer.classList.add('header__buttons-container');

      buttonContainer.appendChild(this._buttonLogin);
      buttonContainer.appendChild(this._buttonLang);

      this._componentDOM.appendChild(buttonContainer);
  }

  /**
   * Создает базовую кнопку и настраивает ее
   */
  _createLoginButton(isButLogin) {

    this._buttonLogin = document.createElement('button');
    this._buttonLogin.classList.add('button');
    this._buttonLogin.classList.add('header__button-login');
    this._buttonLogin.setAttribute('title',
      (isButLogin ? `${Properties.lang.dict.header.login}` : `${Properties.lang.dict.header.logout} (${localStorage.getItem('username')})`));

    const ico = isButLogin ? `<img src="${signInIco}"></img>` : `<img src="${logoutIco}"></img>`;
    this._buttonLogin.insertAdjacentHTML('afterbegin', ico);

  }

  /**
   * создаем языковое меню
   */
   _createLangButton() {

    this._buttonLang = document.createElement('button');
    this._buttonLang.classList.add('button');
    this._buttonLang.classList.add('header__button-login');
    this._buttonLang.setAttribute('title', 'Русский/English');

    const icoLang = `<img src="${langIco}"></img>`;
    this._buttonLang.insertAdjacentHTML('afterbegin', icoLang);

  }

  getButtonLogin() {
    return this._buttonLogin;
  }

  getLangButton() {
    return this._buttonLang;
  }

  /**
   * Создает пункты меню
   */
  _createMenuItems() {
    this._menuItemMain = this._componentDOM.querySelector('.menu-item-main');
    this._menuItemsList.push(this._menuItemMain);

    this._menuItemSearch = this._componentDOM.querySelector('.menu-item-search');
    this._menuItemsList.push(this._menuItemSearch);

    this._menuItemSandBox = this._componentDOM.querySelector('.menu-item-sandbox');
    this._menuItemsList.push(this._menuItemSandBox);
  }

  /**
   * Устанавливает обработчики событий для ВСЕХ пунктов меню
   */
  _setMenuItemsListeners() {
    if (this._menuActions instanceof Object) {
      this._setMenuItemListener(this._menuItemMain, this._menuActions.main);
      this._setMenuItemListener(this._menuItemSearch, this._menuActions.search);
      this._setMenuItemListener(this._menuItemSandBox, this._menuActions.sandBox);
    }

  }

  /**
   * Устанавливает обработчик на пункте меню
   * @param {Element} item элемент меню
   * @param {Function} handler обработчик
   */
  _setMenuItemListener(item, handler) {
    item.addEventListener('click', () => {
      handler.call(this, []);
      this.setActiveMenuItem(item);
    })
  }

  /**
   * Устанавливает активный пункт меню
   */
  setActiveMenuItem(activeItem) {
    this._menuItemsList.forEach(element => {
      if (activeItem !== element) {
        element.classList.remove('menu-link_selected');
      } else {
        element.classList.add('menu-link_selected');
      }
    });
  }

  getMenuItemSearch() {
    return this._menuItemSearch;
  }

}