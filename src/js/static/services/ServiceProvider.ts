import Api from "../../api/Api";
import ServiceBuilder from "./ServiceBuilder";

/**
 * Класс сервис-провайдера
 */
 export default class ServiceProvider {

  /**
   * Свойства
   */
  _props : { [key: string]: any };

  /**
   * Документ
   */
  _currentDocument : { [key: string]: any } = null; //{}

  /**
   * Построитель представления сервиса
   */
  _serviceBuilder : ServiceBuilder;

  /**
   * API-объект для работы с сервером
   */
  _api : Api;

  constructor(props : { [key: string]: any }) {
    this._props = props;
    this._serviceBuilder = this._props.serviceBuilder;
    this._api = this._props.api;
  }

  getProperties() {
    return this._props;
  }

  setProperties(props : { [key: string]: any }) {
    this._props = props;
  }

  getCurrentDocument() {
    return this._currentDocument;
  }

  setCurrentDocument(doc : { [key: string]: any }) {
    this._currentDocument = doc;
  }

  getServiceBuilder() {
    return this._serviceBuilder;
  }

  setServiceBuilder(builder : ServiceBuilder) {
    this._serviceBuilder = builder;
    this._props.serviceBuilder = this._serviceBuilder;
  }

  getApi() {
    return this._api;
  }

  setApi(api : Api) {
    this._api = api;
  }

}