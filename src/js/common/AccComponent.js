/**
 * Базовый класс компонента приложения
 */
export default class AccComponent {

  /**
   * Идентификатор компонента
   */
  _id;

  /**
   * Свойства компонента
   */
  _props;

  /**
   * DOM компонента
   */
  _componentDOM;

  /**
   * DOM компонент preloadera
   */
  _preloaderComponentDOM;

  /**
   * DOM компонент - нет данных
   */
  _emptyComponentDOM;

  /**
   * DOM компонент ошибки
   */
  _errorComponentDOM;


  constructor(props) {
    this.setId(AccComponent.createId());
    this._props = props;
  }

  /**
   * Создает DOM компонента и сохраняет его в _componentDOM
   * Переопределяется
   */
  createDOM() {
  }

  /**
   * Формирует прeлоудер и сохраняет его в _componentDOM
   */
  addPreloaderDOM(loaderText) {

    this._preloaderComponentDOM = document.createElement('div');
    this._preloaderComponentDOM.classList.add('preloader-container');

    const loaderHTML = `<i class="circle-preloader"></i>
                        <p class="preloader-container__title">${loaderText}</p>`;
    this._preloaderComponentDOM.insertAdjacentHTML('afterbegin', loaderHTML);

    if (this._componentDOM) {
      this._componentDOM.appendChild(this._preloaderComponentDOM);
    }
    else {
      this._componentDOM = this._preloaderComponentDOM;
    }
  }

  /**
   * Формирует сообщение об отсутствии содержания и сохраняет его в _componentDOM
   */
  addNoEntityDOM(text) {

    this._emptyComponentDOM = document.createElement('div');
    this._emptyComponentDOM.classList.add('preloader-container');

    const messageHTML = `<div class="preloader-container__image preloader-container__image_nofound"></div>
                        <p class="preloader-container__title">${text}</p>`;
    this._emptyComponentDOM.insertAdjacentHTML('afterbegin', messageHTML);

    if (this._componentDOM) {
      this._componentDOM.appendChild(this._emptyComponentDOM);
    }
    else {
      this._componentDOM = this._emptyComponentDOM;
    }

  }

    /**
   * Формирует сообщение об ошибке и сохраняет его в _componentDOM
   */
  addErrorDOM(textErr) {

    this._errorComponentDOM = document.createElement('div');
    this._errorComponentDOM.classList.add('preloader-container');

    const messageHTML = `<div class="preloader-container__image preloader-container__image_error"></div>
                        <p class="preloader-container__title">${textErr}</p>`;
    this._errorComponentDOM.insertAdjacentHTML('afterbegin', messageHTML);

    if (this._componentDOM) {
      this._componentDOM.appendChild(this._errorComponentDOM);
    }
    else {
      this._componentDOM = this._errorComponentDOM;
    }

  }

  /**
   * Очищает содержание компонента кроме корневого элемента
   */
  clearContent() {
    while (this._componentDOM.firstChild) {
      this._componentDOM.removeChild(this._componentDOM.firstChild);
    }
  }

  /**
   * Очищает содержимое компонента и удаляет сам компонент
   */
  clear() {
    this.clearContent();
    this._componentDOM.remove();
  }

  /**
   * Возвращает DOM компонента
   */
  getDOM() {
    return this._componentDOM;
  }

  /**
   * Формирует уникальный номер элемента
   * @returns значение GIUD/UUID
   */
  static createId() {

    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

    function guid() {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    return guid();
  }

  getId() {
    return this._id;
  }

  setId(value) {
    this._id = value;
  }

  getProps() {
    return this._props;
  }

  setProps(value) {
    this._props = value;
  }

  getPreloaderComponentDOM() {
    return this._preloaderComponentDOM;
  }

  setPreloaderComponentDOM(value) {
    this._preloaderComponentDOM = value;
  }

  getEmptyComponentDOM() {
    return this._emptyComponentDOM;
  }

  setEmptyComponentDOM(value) {
    this._emptyComponentDOM = value;
  }

  getErrorComponentDOM() {
    return this._errorComponentDOM;
  }

  setErrorComponentDOM(value) {
    this._errorComponentDOM = value;
  }

}