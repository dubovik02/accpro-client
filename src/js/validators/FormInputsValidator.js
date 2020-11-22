/**
 * Класс валидатора формы
 */
export default class FormInputsValidator {


  _form = null;
  _inputs = [];
  _errors = [];
  _submitBut = null;

  _ERR_SIZE_STRING_MESSAGE;
  _ERR_REQ_INPUT_MESSAGE;
  _ERR_REQ_LINK_MESSAGE;
  _ERR_REQ_EMAIL_MESSAGE;
  _ERR_SIZE_PASSWORD_MESSAGE;
  _ERR_ALLOW_LETTERS_MESSAGE;

  static MIN_STRING_LENGTH = 2;
  static MAX_STRING_LENGTH = 30;

  /**
   * Конструктор
   * @param {Element} form форма для проверки
   * @param {Object} msgObj объект сообщений при ошибках (поля SizeErrMessage, MissingErrMessage, LinkErrMessage)
   */
  constructor(form, msgObj) {
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
  _checkInputValidity(inputEl, errEl) {

    inputEl.setCustomValidity('');
    errEl.textContent = '';

    if (inputEl.validity.valueMissing) {
      this._setErrors(inputEl, errEl, this._ERR_REQ_INPUT_MESSAGE);
      return false;
    }

    if ((inputEl.validity.tooShort || (inputEl.value.length > FormInputsValidator.MAX_STRING_LENGTH)) && inputEl.type !== 'url' && inputEl.type !== 'password') {
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
  _setErrors(inputEl, errEl, message) {
    inputEl.setCustomValidity(message);
    errEl.textContent = message;
  }

  /* Функция, меняющая состояние кнопки сабмита по итогу вычисления
  * истинности массива.
  * Если каждый элемент массива статусов true - кнопка активна.
  * Если хотя бы один false - кнопка не активна.
  * @param {Array} checkArray массив статусов
  */
  _setSubmitButtonStateFromArray(checkArray) {

    const result = checkArray.reduce((prevVal, current) => { return prevVal && current });
    setSubmitButtonState(!result);

  }

  /**
   * Функция, меняющая состояние кнопки сабмита.
   * @param {boolean} isDisabled disabled-статус кнопки сабмита
   */
  _setSubmitButtonState(isDisabled) {
    if (isDisabled) {
      this._submitBut.setAttribute('disabled', isDisabled);
    }
    else {
      this._submitBut.removeAttribute('disabled');
    }
  }

}