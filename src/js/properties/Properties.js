import accDefaultImg from '../../images/accounting.jpg';

export default  {

  /*-Параметры текущего ресурса*/
  site: {
    name: 'Accounting-pro',
    url: 'www.accounting-pro.ru',
    email: 'info@accounting-pro.ru',
  },

  /*-Настройка подключений-*/
  connection: {

    newsapi: {
      token: '065f57bbb65d4e54b4f78c012bc3cffd',
      url: 'https://newsapi.org',
      newsPeriod: 7,
      keywords: [
        'учет',
        'отчетность',
        'МСФООС'
      ]
    },

    accapi: {
      url: 'http://localhost:3000',
    }
  },

  /*-Настройка представления новостей-*/
  newsList: {
    newsPeriod: 60,
    count: 8,
    showStep: 4,
  },

  /*-Настрока представления карточки-*/
  card: {

    /*-Изображение по умолчанию-*/
    defaultImg: accDefaultImg,

    monthesStr:
    [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря'
    ],
  },

  /*-Сообщения об ошибках в полях попапов-*/
  popupErrMsg: {
    SizeErrMessage: 'Должно быть от 2 до 30 символов',
    MissingErrMessage: 'Это обязательное поле',
    LinkErrMessage: 'Здесь должна быть ссылка',
    EmailErrMessage: 'Укажите валидный e-mail',
    PasswordLengthErrMessage: 'Должно быть не менее 8 символов',
    AllowLettersMessage: 'Используйте только буквы и дефис'
  },

  /*-Настройки сервиса Песoчницы-*/
  sandBox: {

    /*-Grid-*/
    grid: {
      /*-Число строк в гриде-*/
      rowCount: 12,
    }

  }

}