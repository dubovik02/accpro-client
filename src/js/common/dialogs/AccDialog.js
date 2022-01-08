import AccComponent from "../../common/AccComponent";

/**
 * Базовый класс диалоговых окон
 */
export default class AccDialog extends AccComponent {


  _displayClassName = 'dialog_is-opened';

  _dialogTitle;

  _dialogIcon;

  _buttonClose;

  constructor(props) {
    super(props);
    this._dialogTitle = this._props.title;
    this._dialogIcon = this._props.icon;
  }

  createDOM() {

    this._componentDOM = document.createElement('div');
    this._componentDOM.classList.add('dialog');

    const dialogHtml = `<div class="dialog__content">
                        <img src="${iconClose}" alt="" class="dialog__close">
                        <img src="${this._dialogIcon}" alt="" class="dialog__icon">
                        <h3 class="dialog__title">${this._dialogTitle}</h3>
                      </div>`;

    this._componentDOM.insertAdjacentHTML('afterbegin', dialogHtml);
    this._contentSection = this._componentDOM.querySelector('.dialog__content');
    this._buttonClose = this._componentDOM.querySelector('.dialog__close');
    this._setDefaultCloseListener();

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
   * Закрытие диалога
   */
  close() {
    document.removeEventListener('keydown', this._escEvent);
    this._componentDOM.classList.remove(this._displayClassName);
    this._componentDOM.remove();
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

}