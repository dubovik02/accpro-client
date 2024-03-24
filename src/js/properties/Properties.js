export default  {

  /*-Параметры текущего ресурса*/
  site: {
    name: 'Accounting-pro',
    url: 'www.accounting-pro.ru',
    email: 'info@accounting-pro.ru',
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