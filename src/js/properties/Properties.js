export default  {

  /*-Параметры текущего ресурса*/
  site: {
    name: 'Debit-credit.tech',
    url: 'www.debit-credit.tech',
    email: 'info@debit-credit.tech',
    host: new URL(document.location).host,
  },

  /*-Языковые настройки*/
  lang: {
    dict: null,
  },

  /*-Настройка подключений-*/
  connection: {
    accapi: {
      url: 'http://localhost:3000',
      // url: 'https://debit-credit.tech/',
    }
  },

  /*-Настройки сервиса Песoчницы-*/
  sandBox: {

    /*-Grid-*/
    grid: {
      /*-Число строк в гриде-*/
      rowCount: 12,
    }

  },

  /*-Настройки сервиса поиска-*/
  search: {
    minchar: 3,
    maxchar: 100,
    maxTopTagsCount: 5,
  },

}