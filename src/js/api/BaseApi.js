/**
 * Класс настроек взаимодействия с API
 */

export default class BaseApi {

  _serverHttp;
  _userToken;

  constructor(serverHttp, userToken) {
    this._serverHttp = serverHttp;
    this._userToken = userToken;
  }

  getServerHttp() {
    return this._serverHttp;
  }

  setServerHttp(value) {
    this._serverHttp = value;
  }

  getUserToken() {
    return this._userToken;
  }

  setUserToken(value) {
    this._userToken = value;
  }

  /**
   * Разбор ответа сервера
   * @param {Promise} resPromise первичный ответ
   * @returns {Promise} ошибка или ответ
   */
  parseResponse(resPromise) {

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
