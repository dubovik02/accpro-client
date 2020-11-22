import './style.css';
import HeaderBuilder from './js/static/HeaderBuilder';
import FooterBuilder from './js/static/FooterBuilder';
import NewsBuilder from './js/static/sections/NewsBuilder';
import Properties from './js/properties/Properties';
import CardsList from './js/common/card/CardsList'
import Card from './js/common/card/Card';
import Api from './js/api/Api';
import BriefBuilder from './js/static/BriefBuilder';
import FormsFactory from './js/common/factories/FormsFactory';
import SignUpPopUp from './js/static/popups/SignUpPopUp';
import FormInputsValidator from './js/validators/FormInputsValidator';
import SignInPopUp from './js/static/popups/SignInPopUp';
import AccComponent from './js/common/AccComponent';

/*-------------Константы----------------*/


/*-------------Переменные----------------*/
const page = document.querySelector('.page');
const contentSection = document.querySelector('.content');

/*-Api-*/
//const newsApi = new NewsApi(Properties.connection.newsapi.url, Properties.connection.newsapi.token);
const api = new Api(Properties.connection.accapi.url, localStorage.getItem('jwt'));

/*-Header-*/
let header;

/*-Бриф-*/
let brief;

/*-News-*/
let newsSection;
let newsCardsList;

/*-Попапы-*/
/*-Регистрация-*/
let popupSignUp;
/*-Вход-*/
let popupSignIn;
/*-------------Функции-------------------*/

/**
 * Общая процедура, вызываемая при загрузки страницы
 */
function onLoadDOM() {

  makeHeader();
  makeBriefSection();
  makeNewsSection();
  //makeAccountingSection();
  //makeInterestingFactSections();
  makeFooter();

}

/**
 * Формирует заголовок
 */
function makeHeader() {

  const isLoggedIn = localStorage.getItem('jwt');

  if (header instanceof AccComponent) {
    header.getDOM().remove();
  }

  header = new HeaderBuilder(
    {
      isButLogin: isLoggedIn !== null ? false : true,
      username: localStorage.getItem('username'),
    }
  );
  header.createDOM();

  if (isLoggedIn) {
    header.getControlButton().addEventListener('click', logout);
  }

  popupSignIn = new SignInPopUp({
    title: 'Войти в систему',
    butOpen: isLoggedIn !== null ? null : header.getControlButton(),
    form: new FormsFactory().createSignInForm('signin'),
    submitFunction: signIn,
    signUpFunction: showSignUpPopup,
  });

  const validator = new FormInputsValidator(popupSignIn.getForm(), Properties.popupErrMsg);

  contentSection.insertAdjacentElement('afterbegin', header.getDOM());
}

/**
 * Формирует brief-секцию
 */
function makeBriefSection() {

  if (localStorage.getItem('jwt')) {
    brief.getDOM().remove();
  }
  else {
    brief = new BriefBuilder({});
    brief.createDOM();

    popupSignUp = new SignUpPopUp({
      title: 'Регистрация пользователя',
      butOpen: brief.getButtonSignUp(),
      form: new FormsFactory().createSignUpForm('signup'),
      submitFunction: signUp,
      signInFunction: showSignInPopup,
    });

    const validator = new FormInputsValidator(popupSignUp.getForm(), Properties.popupErrMsg);

    contentSection.appendChild(brief.getDOM());
  }
}

/**
 * Формирует секцию новостей
 */
function makeNewsSection() {

  newsSection = new NewsBuilder({
    cardsList: new CardsList({}),
    showStep: Properties.newsList.showStep,
  });
  newsSection.createDOM();
  newsSection.addPreloaderDOM('Минуточку, загружаем новости ...');

  contentSection.appendChild(newsSection.getDOM());

  const nowDate = new Date();
  nowDate.setHours(23,59,59,999);
  const nowDateStr = parseDateToYMDString(nowDate);

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - Properties.newsList.newsPeriod);
  fromDate.setHours(0,0,0,0);
  const fromDateStr = parseDateToYMDString(fromDate);

  api.getNews(fromDateStr, nowDateStr)
  .then((res) => {
    newsSection.getPreloaderComponentDOM().remove();
    if (res.length === 0) {
      newsSection.addNoEntityDOM('Новостей на сегодня нет :(');
    }
    else {
      newsCardsList = new CardsList({});
      res.forEach((item) => {
        const card = new Card({
          url: item.link,
          publishedAt: item.date,
          keyWord: item.keyword,
          urlToImage: item.image,
          title: item.title,
          description: item.text,
          source: item.source,
        });

        newsCardsList.addCard(card);
        newsSection.setCardsList(newsCardsList);
        newsSection.createDOM();
        contentSection.appendChild(newsSection.getDOM());
      });
    }
  })
  .catch((err) => {
    newsSection.getPreloaderComponentDOM().remove();
    newsSection.addErrorDOM(`Ошибка: ${err.message}`);
  });
}

/**
 * Формирует Footer
 */
function makeFooter() {
  const footer = new FooterBuilder({});
  footer.createDOM();
  page.appendChild(footer.getDOM());
}

/**
 * Функция регистрации пользователя (коллбэк для регистрации)
 */
function signUp(params) {

  return api.signUp(params.userName, params.userPass, params.userEmail)
    .then((res) => {
      signIn(params);//сразу входим после успешной регистрации
      return res;
    })
    .catch((err) => {
      return Promise.reject(err);
    });

}

/**
 * Функция входа
 */
function signIn(params) {

  return api.signIn(params.userEmail, params.userPass)
    .then((res) => {
      localStorage.setItem('jwt', res.jwt);
      localStorage.setItem('username', res.name);
      makeHeader();
      makeBriefSection();
      return res;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

/**
 * Функция логаута
 */
function logout() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('username');
  document.location = './index.html';
}

/**
 * Показывает попап входа
 */
function showSignInPopup() {
  popupSignIn.open();
}

/**
 * Показывает попап регистрации
 */
function showSignUpPopup() {
  popupSignUp.open();
}


/**
 * Преобразование даты в строку гггг-мм-дд
 */
function parseDateToYMDString(date) {

  const monthDate = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
  return `${date.getFullYear()}-${date.getMonth() + 1}-${monthDate}`;
}

/*----------------------------Обработчики событий--------------------------------*/

/**
 * загрузкa DOM
 * */
document.addEventListener('DOMContentLoaded', onLoadDOM);