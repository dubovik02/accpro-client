import BaseApi from './BaseApi';

/**
 * Класс настроек взаимодействия с бэкенд частью
 */

export default class Api extends BaseApi {

  constructor(serverHttp) {
    super(serverHttp, null);
  }

  /**
   * Регистрация пользоваателя
   */
  signUp(userName, userPass, userEmail) {

    return this.parseResponse(fetch(`${this._serverHttp}/signup`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          name: userName,
          password: userPass,
          email: userEmail
        })
      }));
  }

  /**
   * Вход пользоваателя
   */
  signIn(userEmail, userPass) {

    return this.parseResponse(fetch(`${this._serverHttp}/signin`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          password: userPass,
          email: userEmail
        })
      }));
  }

  /**
   * Добавление карточки
   */
  addCard(cardData) {

    return this.parseResponse(fetch(`${this._serverHttp}/articles`,
      {
        credentials: 'include',

        method: 'POST',

        headers: {
          authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          keyword: cardData.keyword,
          title: cardData.title,
          text: cardData.description,
          source: cardData.source.name,
          date: cardData.publishedAt,
          link: cardData.url,
          image: cardData.urlToImage
        })

      }));
  }

  /**
   * Получение списка карточек пользователя
   */
  getCards(userId) {

    return this.parseResponse(fetch(`${this._serverHttp}/articles/${userId}`,
      {
        credentials: 'include',

        method: 'GET',

        headers: {
          authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }

      }));
  }

  /**
   * Получение списка карточек новостей
   */
  getNews(dateFrom, dateTo) {

    return this.parseResponse(fetch(`${this._serverHttp}/articles/?from=${dateFrom}&to=${dateTo}`,
      {

        method: 'GET',

        headers: {
          'Content-Type': 'application/json'
        }

      }));
  }

  /**
   * Получение списка карточек новостей по ключевым словам
   */
  getNewsByKeyWords(dateFrom, dateTo, keyWordsArr) {

    let reqParams = `${this._serverHttp}/articles/filter/?from=${dateFrom}&to=${dateTo}&`;
    if (keyWordsArr) {
        keyWordsArr.forEach(item => {
        reqParams = reqParams + `keyWords[]=${item}&`
      })
    }


    return this.parseResponse(fetch(reqParams,
      {

        method: 'GET',

        headers: {
          'Content-Type': 'application/json'
        }

      }));
  }

  /**
   * Удаляет карточку с сервера
   */
  deleteCard(cardId) {

    return this.parseResponse(fetch(`${this._serverHttp}/articles/${cardId}`,
      {
        credentials: 'include',

        method: 'DELETE',

        headers: {
          authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }
      }));

  }

  /**
   * Сохраняет документ из песочницы
   */
   saveSandBoxDocument(sandBoxDoc) {

    return this.parseResponse(fetch(`${this._serverHttp}/sbdocs/new`,
    {
      credentials: 'include',

      method: 'POST',

      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(sandBoxDoc),

    }));

  }

  /**
   * Возвращает все документы пользователя
   */
  getUserSandBoxDocuments(userId) {

    return this.parseResponse(fetch(`${this._serverHttp}/sbdocs/user/${userId}`,
    {
      credentials: 'include',

      method: 'GET',

      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }

    }));

  }

  /**
   * Возвращает документ по Id
   */
  getSandBoxDocument(docId) {

    return this.parseResponse(fetch(`${this._serverHttp}/sbdocs/${docId}`,
    {
      credentials: 'include',

      method: 'GET',

      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }

    }));

  }

  /**
   * Обновляет документ по Id
   */
  updateSandBoxDocument(sandBoxDoc) {

    return this.parseResponse(fetch(`${this._serverHttp}/sbdocs/${sandBoxDoc._id}`,
    {
      credentials: 'include',

      method: 'PUT',

      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(sandBoxDoc),

    }));

  }

  /**
   *
   * isViewed - был ранее просмотрен или нет
   */
  /**
   * Возвращает расшаренный документ по Id
   * @param {String} docId идентификатор документа
   * @param {Boolean} isViewed отметка о просмотре документа клиентом
   * @returns документ
   */
  getShareSandBoxDocument(docId, isViewed) {

    return this.parseResponse(fetch(`${this._serverHttp}/share/${docId}`,
    {
      credentials: 'include',

      method: 'GET',

      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
        isviewed: isViewed,
      }

    }));

  }

  //изменение рейтинга документа
  likeDoc(docId) {

    return this.parseResponse(fetch(`${this._serverHttp}/like/${docId}`,
      {
        credentials: 'include',

        method: 'PUT',

        headers: {
          authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }
      }));
  }

}
