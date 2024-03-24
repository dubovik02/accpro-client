import AccPopup from "./AccPopup";
import Properties from "../../properties/Properties";
/**
 * Попап сабмита информации
 */
export default class SubmitPopUp extends AccPopup {

  /**
   * Кнопка сабмита
   */
  _submitButton;

  /**
   * Функция сабмита
   */
  _submitFunction;

  /**
   * Запускается после отработки сабмита и закрытия диалога
   */
  _afterCloseDialogFunction;

  /**
   * Элемент отображения общего сообщения об ошибке
   */
  _errorInfo;

  constructor(prop) {
    super(prop);
    this._submitFunction = this._props.submitFunction;
    this._afterCloseDialogFunction = this._props.afterCloseDialogFunction;
  }

  createDOM() {
    super.createDOM();
    if (this.getProps().popupWidth) {
      this.getDOM().querySelector('.popup__content').style.width = this.getProps().popupWidth;
    }
    this._errorInfo = this._form.querySelector('.popup__error-info');
    this._submitButton = this._form.elements.submit;
    this._setSubmitListener();
  }

  _setSubmitListener() {
    this._submitButton.addEventListener('click', this._submit);
  }

  _submit = () => {

    const caption = this._submitButton.textContent;
    this._setButtonSubmitStatus(`${Properties.lang.dict.popups.inProgress} ...`, true);
    this._submitFunction.call(this, this._getInputsValues())
    .then(() => {
      this._setButtonSubmitStatus(caption, false);
      this.close();
      if (this._afterCloseDialogFunction instanceof Function) {
        this._afterCloseDialogFunction.call(this, [])
        .then((_res) => {
        })
        .catch((err) => {
          return Promise.reject(err);
        });
      }
    })
    .catch((err) => {

      if (!(err instanceof Error)) {
        err.json()
        .then((errRes) => {
          this._handleError(errRes, caption);
        });
      }
      else {
        this._handleError(err, caption);
      }

    });
  }

  /**
   * Возвращает объект с параметрами для передачи в коллбэк сабмита
   * (переопределяется в наследниках)
   */
  _getInputsValues() {
  }

  /**
   * Переключение состояния кнопки сабмита
   */
  _setButtonSubmitStatus(caption, isDisabled) {
    this._submitButton.textContent = caption;
    if (isDisabled) {
      this._submitButton.setAttribute('disabled', isDisabled);
    }
    else {
      this._submitButton.removeAttribute('disabled');
    }
  }

  /**
   * Обработка и отображение ошибки сабмита
   */
  _handleError(errRes, butText) {
    this._errorInfo.textContent = errRes.message ? errRes.message : errRes.statusText;
    this._errorInfo.classList.add('popup__error-info_is-visible');
    this._setButtonSubmitStatus(butText, false);
  }

  /**
   * Открытие попапа
   */
  open() {
    super.open();
    this.getForm().addEventListener('keydown', this._enterEvent);
  }

  /**
   * Закрытие попапа
   */
  close() {
    if (this.getForm()) {
      this._form.reset();
      this._form.removeEventListener('keydown', this._enterEvent);
      this._errorInfo.textContent = '';
    }
    super.close();
  }


  /**
   * Обработчик enter
   * @param {Event} event
   */
  _enterEvent = (event) => {
    if (event.keyCode === 13 && !this._submitButton.getAttribute('disabled')) {
      this._submit();
      event.preventDefault();
    }
  }

}