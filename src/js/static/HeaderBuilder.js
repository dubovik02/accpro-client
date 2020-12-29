import AccComponent from '../common/AccComponent';
import logo from '../../images/logo.png';
import signInIco from '../../images/sign-in.png';
import logoutIco from '../../images/logout.png';

/**
 * Класс формирования заголовка
 */

export default class HeaderBuilder extends AccComponent {

  /**
   * Кнопка входа/логаута
   */
  _controlButton;

  /**
   * Меню "Новости"
   */
  _menuItemNews;

  /**
   * Набор пунктов меню
   */
  _menuItemsList = [];

  /**
   * набор экшенов для пунктов меню
   */
  _menuActions

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

      const headerHtml = `<a class="link header__link" href="./index.html">
                            <img class="logo logo_place_header" src="${logo}" alt="логотип"></img>
                          </a>
                          <menu class="menu">
                            <ul class="menu-list">
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold menu-item-news" href="#">Новости</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Первичка и регистры</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Учет</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Отчетность</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Справочники</a></li>
                              <li class="menu-list__item"><a class="link menu-link menu-link_font_bold" href="#">Библиотека</a></li>
                            </ul>
                          </menu>`;

      this._componentDOM.insertAdjacentHTML('afterbegin', headerHtml);

      this._createMenuItems();
      this._setMenuItemsListeners();
      this._createButton(this._props.isButLogin);

      this._componentDOM.appendChild(this._controlButton);
  }

  /**
   * Создает базовую кнопку и настраивает ее
   */
  _createButton(isButLogin) {
    this._controlButton = document.createElement('button');
    this._controlButton.classList.add('button');
    this._controlButton.classList.add('header__button-login');
    this._controlButton.setAttribute('title', (isButLogin ? 'Войти' : `Выход (${localStorage.getItem('username')})`))

    const ico = isButLogin ? `<img src="${signInIco}"></img>` : `<img src="${logoutIco}"></img>`
    this._controlButton.insertAdjacentHTML('afterbegin', ico);
  }

  getControlButton() {
    return this._controlButton;
  }

  /**
   * Создает пункты меню
   */
  _createMenuItems() {
    this._menuItemNews = this._componentDOM.querySelector('.menu-item-news');
    this._menuItemsList.push(this._menuItemNews);
  }

  /**
   * Устанавливает обработчики событий для ВСЕХ пунктов меню
   */
  _setMenuItemsListeners() {
    if (this._menuActions instanceof Object) {
      this._setMenuItemListener(this._menuItemNews, this._menuActions.news);
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

  getMenuItemNews() {
    return this._menuItemNews;
  }

}