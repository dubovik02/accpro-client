/**
 * Класс настроек взаимодействия с API
 */

export default class BaseApi {

  _serverHttp;
  _userToken;

  constructor(serverHttp : String, userToken : String) {
    this._serverHttp = serverHttp;
    this._userToken = userToken;
  }

  getServerHttp() {
    return this._serverHttp;
  }

  setServerHttp(value : String) {
    this._serverHttp = value;
  }

  getUserToken() {
    return this._userToken;
  }

  setUserToken(value : String) {
    this._userToken = value;
  }

  /**
   * Разбор ответа сервера
   * @param {Promise} resPromise первичный ответ
   * @returns {Promise} ошибка или ответ
   */
  parseResponse(resPromise : Promise<any>) {

    return resPromise
      .then((res) => {
        if (!res.ok) {
          return Promise.reject(res);
        }
        else {
          return res.json();
        }
      });
  }
}
