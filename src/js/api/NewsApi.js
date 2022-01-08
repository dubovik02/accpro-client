import BaseApi from './BaseApi';

/**
 * Класс настроек взаимодействия с сервером новостей
 */

export default class NewsApi extends BaseApi {

  constructor(serverHttp, userToken) {
    super(serverHttp, userToken)
  }

  /**
   * Запрос новостей
   */
  getNews(keyWord, fromDate, toDate) {

    return this.parseResponse(fetch(
      `${this._serverHttp}/v2/everything?q=${keyWord}&from=${fromDate}&to=${toDate}&sortBy=publishedAt&apiKey=${this._userToken}`,
      {
        method: 'GET',

        headers: {
          authorization: `${this._userToken}`
        }
      }));
  }

}
