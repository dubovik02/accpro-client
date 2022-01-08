import AccComponent from "../../common/AccComponent";

/**
 * Базовый класс представления сервиса
 */
export default class ServiceBuilder extends AccComponent {

  /**
   * Левая часть статусного контейнера
   */
  _leftContainer;

  /**
   * Центральная часть статусного контейнера
   */
  _centerContainer;

  /**
   * Правая часть статусного контейнера
   */
  _rightContainer;

  /**
   * Иконка сервиса
   */
  _serviceIcon;

  /**
   * Имя сервиса
   */
  _serviceName;

  /**
   * Описание сервиса
   */
  _serviceDescription;

  /**
   * Меню управления сервиса
   */
  _serviceMenu;

  /**
   * Контейнер для содержимого сервиса
   */
  _serviceView;

  constructor(props) {
    super(props);
    this._serviceName = this._props.serviceName;
    this._serviceDescription = this._props.serviceDescription;
  }

  createDOM() {

    this._componentDOM = document.createElement('service-section');
    this._componentDOM.classList.add('service-section');

    const serviceHtml = `<div class="service-section__status-container">

                          <div class="service-section__status-container service-section__status-container_column left-container">
                            <p class="service-section__name">${this._props.serviceName}</p>
                            <p class="service-section__description">${this._props.serviceDescription}</p>
                          </div>

                          <div class="service-section__status-container service-section__status-container_column center-container">

                          </div>

                          <div class="service-section__status-container service-section__status-container_column right-container">

                          </div>

                        </div>

                        <div class="service-section__container">
                          <menu class="service-section__menu">

                          </menu>
                          <div class="service-section__view">

                          </div>
                        </div>`;

    this._componentDOM.insertAdjacentHTML('afterbegin', serviceHtml);

    this._serviceMenu = this._componentDOM.querySelector('.service-section__menu');
    this._serviceView = this._componentDOM.querySelector('.service-section__view');
    this._leftContainer = this._componentDOM.querySelector('.left-container');
    this._centerContainer = this._componentDOM.querySelector('.center-container');
    this._rightContainer = this._componentDOM.querySelector('.right-container');
  }

  /**
   * Устанавливает текущие данные в соответствии с объектом.
   * Переопределяется в потомках
   * @param {Object} doc объект-документ
   */
  loadData(doc) {

  }

  /**
   * Возвращает данные в формате объекта.
   * Переопределяется в потомках
    * @returns {Object} объект-документ
  */
  getData() {
    return {};
  }
}