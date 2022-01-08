import AccComponent from "../AccComponent";
import iconClose from '../../../images/close.svg';

/**
 * Базовый класс попапа
 */
export default class AccPopup extends AccComponent {

  /**
   * Заголовок попапа
   */
  _popUpTitle;

  /**
   * Кнопка открытия попапа
   */
  _buttonOpen;

  /**
   * Имя модификатора показа попапа
   */
  _displayClassName = 'popup_is-opened';

  /**
   * Контентная секция
   */
  _contentSection;

  /**
   * Форма ввода и отображения информации
   */
  _form;

  constructor(props) {
    super(props);
    this._popUpTitle = this._props.title;
    this._form = this._props.form;
    this._buttonOpen = this._props.butOpen;
    this._setDefaultOpenListener();
  }

  createDOM() {

    this._componentDOM = document.createElement('div');
    this._componentDOM.classList.add('popup');

    const popupHtml = `<div class="popup__content">
                        <img src="${iconClose}" alt="" class="popup__close">
                        <h3 class="popup__title">${this._popUpTitle}</h3>
                      </div>`;

    this._componentDOM.insertAdjacentHTML('afterbegin', popupHtml);

    this._contentSection = this._componentDOM.querySelector('.popup__content');

    this._buttonClose = this._componentDOM.querySelector('.popup__close');
    this._setDefaultCloseListener();

    if (this._form instanceof AccComponent) {
      this._form.createDOM();
      this._contentSection.appendChild(this._form.getDOM());
    }
    else if (this._form instanceof Element){
      this._contentSection.appendChild(this._form);
    }

  }

  /**
   * Устанавливает слушатель открытия попапа
   */
  _setDefaultOpenListener() {

    if (this._buttonOpen instanceof Element) {
      this._buttonOpen.addEventListener('click', () => {
        this._buttonOpen.blur();
        this.open();
      });
    }
  }

  /**
   * Устанавливает слушатель закрытия попапа
   */
  _setDefaultCloseListener() {

    if (this._buttonClose instanceof Element) {
      this._buttonClose.addEventListener('click', () => {
        this.close();
      });
    }
  }

  /**
   * Открытие попапа
   */
  open() {
    document.addEventListener('keydown', this._escEvent);
    this.createDOM();
    document.body.appendChild(this._componentDOM);
    this._componentDOM.classList.add(this._displayClassName);
    this._componentDOM
  }

  /**
   * Закрытие попапа
   */
  close() {
    document.removeEventListener('keydown', this._escEvent);
    this._componentDOM.classList.remove(this._displayClassName);
    this._componentDOM.remove();//надо ли удалять?
  }

  /**
   * Обработчик esc
   * @param {Event} event
   */
  _escEvent = (event) => {
    if (event.keyCode === 27) {
      this.close();
    }
  }

  getForm() {
    return this._form;
  }

}