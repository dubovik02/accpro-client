import AccComponent from "../../common/AccComponent";

/**
 * Базовый класс представления сервиса
 */
export default class ServiceBuilder extends AccComponent {


  /**
   * Иконка сервиса
   */
  _serviceIcon

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

    const serviceHtml = `<p class="service-section__name">${this._props.serviceName}</p>
                        <p class="service-section__description">${this._props.serviceDescription}</p>

                        <div class="service-section__container">
                          <menu class="service-section__menu">

                          </menu>
                          <div class="service-section__view">

                          </div>
                        </div>`;

    this._componentDOM.insertAdjacentHTML('afterbegin', serviceHtml);

    this._serviceMenu = this._componentDOM.querySelector('.service-section__menu');
    this._serviceView = this._componentDOM.querySelector('.service-section__view');
  }
}