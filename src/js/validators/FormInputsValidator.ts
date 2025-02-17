/**
 * Класс валидатора формы
 */
export default class FormInputsValidator {


  _form : HTMLElement = null;
  _inputs : Array<HTMLInputElement> = [];
  _errors : Array<HTMLElement> = [];
  _submitBut : HTMLElement = null;

  _ERR_SIZE_STRING_MESSAGE : string;
  _ERR_REQ_INPUT_MESSAGE : string;
  _ERR_REQ_LINK_MESSAGE : string;
  _ERR_REQ_EMAIL_MESSAGE : string;
  _ERR_SIZE_PASSWORD_MESSAGE : string;
  _ERR_ALLOW_LETTERS_MESSAGE : string;
  _ERR_ALLOW_TAGS_MESSAGE : string;


  static MIN_STRING_LENGTH : number = 2;
  static MAX_STRING_LENGTH : number = 30;

  /**
   * Конструктор
   * @param {Element} form форма для проверки
   * @param {Object} msgObj объект сообщений при ошибках (поля SizeErrMessage, MissingErrMessage, LinkErrMessage)
   */
  constructor(form : HTMLElement, msgObj : { [key: string]: any } ) {
    this._form = form;
    if (this._form !== null) {
      this._setElements();
      this._setEventListeners();
    }
    this._ERR_SIZE_STRING_MESSAGE = msgObj.SizeErrMessage;
    this._ERR_REQ_INPUT_MESSAGE = msgObj.MissingErrMessage;
    this._ERR_REQ_LINK_MESSAGE = msgObj.LinkErrMessage;
    this._ERR_REQ_EMAIL_MESSAGE = msgObj.EmailErrMessage;
    this._ERR_SIZE_PASSWORD_MESSAGE = msgObj.PasswordLengthErrMessage;
    this._ERR_ALLOW_LETTERS_MESSAGE = msgObj.AllowLettersMessage;
    this._ERR_ALLOW_TAGS_MESSAGE = msgObj.AllowTagsMessage;
  }

  /**
   * Устанавливает обработчик
   */
  _setEventListeners() {
    this._form.addEventListener('input', () => {
      this._checkValidity();
    });
  }

  /**
   * Извлекает из формы инпуты, индикаторы ошибок и кнопку submit
   */
  _setElements() {

    this._submitBut = this._form.querySelector('.button');
    this._setSubmitButtonState(true);

    this._inputs = Array.from(this._form.querySelectorAll('.popup__input'));
    this._errors = Array.from(this._form.querySelectorAll('.popup__error-label'));

  }

  /**
   * Основной метод проверки
   */
  _checkValidity() {

    let result = true;
    this._inputs.forEach((item, idx) => {
      const currentresult = this._checkInputValidity(item, this._errors[idx]);
      result = result && currentresult;
    });

    this._setSubmitButtonState(!result);
  }

  /**
   * Метод проверки элемента
   */
  _checkInputValidity(inputEl : HTMLInputElement, errEl : HTMLElement) {

    inputEl.setCustomValidity('');
    errEl.textContent = '';

    if (inputEl.validity.valueMissing) {
      this._setErrors(inputEl, errEl, this._ERR_REQ_INPUT_MESSAGE);
      return false;
    }

    if ((inputEl.validity.tooShort || (inputEl.value.length > FormInputsValidator.MAX_STRING_LENGTH)) && inputEl.type !== 'url' && inputEl.type !== 'password' && inputEl.type !== 'textarea') {
      this._setErrors(inputEl, errEl, this._ERR_SIZE_STRING_MESSAGE);
      return false;
    }

    if (inputEl.validity.tooShort && inputEl.type === 'password') {
      this._setErrors(inputEl, errEl, this._ERR_SIZE_PASSWORD_MESSAGE);
      return false;
    }

    if (inputEl.validity.typeMismatch && inputEl.type === 'url') {
      this._setErrors(inputEl, errEl, this._ERR_REQ_LINK_MESSAGE);
      return false;
    }

    if (inputEl.validity.patternMismatch && inputEl.type === 'email') {
      this._setErrors(inputEl, errEl, this._ERR_REQ_EMAIL_MESSAGE);
      return false;
    }

    //если проверяем поле с тэгами - id поля должно быть input-tags
    if (inputEl.validity.patternMismatch && inputEl.type === 'text' && inputEl.id === 'input-tags') {
      this._setErrors(inputEl, errEl, this._ERR_ALLOW_TAGS_MESSAGE);
      return false;
    }

    if (inputEl.validity.patternMismatch && inputEl.type === 'text') {
      this._setErrors(inputEl, errEl, this._ERR_ALLOW_LETTERS_MESSAGE);
      return false;
    }

    return true;

  }

  /**
   * Вспомогательная функция
   * @param {Element} inputEl элемент ввода
   * @param {Element} errEl элемент ошибки
   * @param {string} message сообщение об ошибке
   */
  _setErrors(inputEl : HTMLInputElement, errEl : HTMLElement, message : string) {
    inputEl.setCustomValidity(message);
    errEl.textContent = message;
  }

  /* Функция, меняющая состояние кнопки сабмита по итогу вычисления
  * истинности массива.
  * Если каждый элемент массива статусов true - кнопка активна.
  * Если хотя бы один false - кнопка не активна.
  * @param {Array} checkArray массив статусов
  */
  _setSubmitButtonStateFromArray(checkArray : Array<boolean>) {

    const result = checkArray.reduce((prevVal, current) => { return prevVal && current });
    this._setSubmitButtonState(!result);

  }

  /**
   * Функция, меняющая состояние кнопки сабмита.
   * @param {boolean} isDisabled disabled-статус кнопки сабмита
   */
  _setSubmitButtonState(isDisabled : boolean) {
    if (isDisabled) {
      this._submitBut.setAttribute('disabled', String(isDisabled));
    }
    else {
      this._submitBut.removeAttribute('disabled');
    }
  }

}