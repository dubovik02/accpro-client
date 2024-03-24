/**
 * Класс сервис-провайдера
 */
 export default class ServiceProvider {

  /**
   * Свойства
   */
  _props;

  /**
   * Документ
   */
  _currentDocument = null; //{}

  /**
   * Построитель представления сервиса
   */
  _serviceBuilder;

  /**
   * API-объект для работы с серером
   */
  _api;

  constructor(props) {
    this._props = props;
    this._serviceBuilder = this._props.serviceBuilder;
    this._api = this._props.api;
  }

  getProperties() {
    return this._props;
  }

  setProperties(props) {
    this._props = props;
  }

  getCurrentDocument() {
    return this._currentDocument;
  }

  setCurrentDocument(doc) {
    this._currentDocument = doc;
  }

  getServiceBuilder() {
    return this._serviceBuilder;
  }

  setServiceBuilder(builder) {
    this._serviceBuilder = builder;
    this._props.serviceBuilder = this._serviceBuilder;
  }

  getApi() {
    return this._api;
  }

  setApi(api) {
    this._api = api;
  }

}