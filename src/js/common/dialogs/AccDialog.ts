import AccComponent from "../AccComponent";
import iconClose from '../../../images/close.svg';

/**
 * Базовый класс диалоговых окон
 */
export default class AccDialog extends AccComponent {

  //сообщение диалога
  _dialogMessage : string;

  //заколовок диалога
  _dialogTitle : string;

  //Кнопка закрытия попапа
  _iconClose : Element;

  //Имя модификатора показа попапа
  _displayClassName : string = 'dialog_is-opened';

  //секция заголовка
  _headerSection : Element;

  //Контентная секция
  _contentSection : Element;

  //секция формы ввода данных
  _formSection : Element;

  //Секция управляющих элементов (ок, отмена и т.п.)
  _buttonsSection : Element;

  //Форма ввода и отображения информации
   _form : Element;


   constructor(props : { [key: string]: any }) {
     super(props);
     this._dialogTitle = this._props.title ? this._props.title : '';
     this._dialogMessage = this._props.message;
     this._form = this._props.form;
     // this._setDefaultOpenListener();
   }

   createDOM() {

     this._componentDOM = document.createElement('div');
     this._componentDOM.classList.add('dialog');

    const popupHtml = `<div class="dialog__content">
                         <img src="${iconClose}" alt="" class="dialog__close">
                         <div class="dialog__header-section">
                          <img src="${this._props.icon}" class="dialog__icon">
                          <div class="dilog__header-section dilog__header-section_column">
                            <p class="dialog__title">${this._dialogTitle}</p>
                            <p class="dialog__text">${this._dialogMessage}</p>
                          </div>
                         </div>
                         <div class="dialog__form-section"></div>
                         <div class="dialog__button-section"></div>
                       </div>`;

     this._componentDOM.insertAdjacentHTML('afterbegin', popupHtml);

     this._contentSection = this._componentDOM.querySelector('.dialog__content');

     this._iconClose = this._componentDOM.querySelector('.dialog__close');
     this._setDefaultCloseListener();

     if (this._form instanceof AccComponent) {
       this._form.createDOM();
       this._contentSection.appendChild(this._form.getDOM());
     }
     else if (this._form instanceof Element){
       this._contentSection.appendChild(this._form);
     }

     this._buttonsSection = this._componentDOM.querySelector('.dialog__button-section');
     this._headerSection = this._componentDOM.querySelector('.dialog__header-section');
     this._formSection = this._componentDOM.querySelector('.dialog__form-section');

   }

   /**
    * Устанавливает слушатель открытия попапа
    */
  //  _setDefaultOpenListener() {

  //    if (this._buttonOpen instanceof Element) {
  //      this._buttonOpen.addEventListener('click', () => {
  //        this._buttonOpen.blur();
  //        this.open();
  //      });
  //    }
  //  }

   /**
    * Устанавливает слушатель закрытия попапа
    */
   _setDefaultCloseListener() {

     if (this._iconClose instanceof Element) {
       this._iconClose.addEventListener('click', () => {
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
   _escEvent = (event : KeyboardEvent) => {
     if (event.keyCode === 27) {
       this.close();
     }
   }

   getForm() {
     return this._form;
   }

}