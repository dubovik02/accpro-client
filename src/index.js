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
import { getNewsPeriod } from './js/lib/date';
import SandBoxBuilder from './js/static/services/SandBoxBuilder';
import Account from './js/common/accounting/Account';
import AccountsSet from './js/common/accounting/AccountsSet';
import AccountingEntriesSet from './js/common/accounting/AccountingEntriesSet';
import AccountingEntry from './js/common/accounting/AccountingEntry';

/*-------------Константы----------------*/


/*-------------Переменные----------------*/
const page = document.querySelector('.page');
const contentSection = document.querySelector('.content');
const contentSectionContainer = document.querySelector('.content-container');

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

/*-Песочница-*/
let sandBoxServiceSection;

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
  makeFooter();

}

/**
 * Функция формирования заголовка
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
      menuActions: {
        news: onNews,
        sandBox: onSandBox,
      },
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
    if (brief instanceof AccComponent) {
      brief.getDOM().remove();
    }

    makeNewsSection();
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

    //contentSection.appendChild(brief.getDOM());
    contentSectionContainer.appendChild(brief.getDOM());
  }
}

/**
 * Формирует секцию новостей
 */
function makeNewsSection() {

  // if (newsSection instanceof AccComponent) {
  //   return;
  // }

  newsSection = new NewsBuilder({
    cardsList: new CardsList({}),
    showStep: Properties.newsList.showStep,
    filterFunction: filterNewsSection,
  });
  newsSection.createDOM();
  newsSection.addPreloaderDOM('Минуточку, загружаем новости ...');

  //contentSection.appendChild(newsSection.getDOM());
  contentSectionContainer.appendChild(newsSection.getDOM());

  //const {nowDateStr, fromDateStr} = getNewsPeriod();
  const {nowDateStr, fromDateStr} = getNewsPeriod(true);

  api.getNews(fromDateStr, nowDateStr)
  .then((res) => {
    newsSection.getPreloaderComponentDOM().remove();
    if (res.length === 0) {
      newsSection.addNoEntityDOM('Новостей на сегодня нет :(');
    }
    else {
      newsCardsList = new CardsList({});
      res.forEach((item) => {
        const cardData = dbCardTransform(item);
        const card = new Card(cardData);
        newsCardsList.addCard(card);
      });
      newsSection.setCardsList(newsCardsList);
      newsSection.createDOM();
      //contentSection.appendChild(newsSection.getDOM());
      contentSectionContainer.appendChild(newsSection.getDOM());
    }
  })
  .catch((err) => {
    newsSection.getPreloaderComponentDOM().remove();
    newsSection.addErrorDOM(`Ошибка: ${err.message}`);
  });

  header.setActiveMenuItem(header.getMenuItemNews());
}

/**
 * Накладывает фильтр на секцию новостей (коллбэк события фильтрации)
 */
function filterNewsSection(keyWordsArr, fromDateStr, toDateStr) {

  //Очищаем предыдущие активности
  if (newsSection.getEmptyComponentDOM()) {
    newsSection.getEmptyComponentDOM().remove();
  }

  if (newsSection.getErrorComponentDOM()) {
    newsSection.getErrorComponentDOM().remove();
  }

  //очищаем блок карточек
  newsSection.deleteCards();
  //делаем прелоадер
  newsSection.addPreloaderDOM('Отбираем новости .....');

  //Получаем данные карточек по условиям фильтрации и отрисовываем их
  return api.getNewsByKeyWords(fromDateStr, toDateStr, keyWordsArr)
  .then((res) => {
    newsSection.getPreloaderComponentDOM().remove();
    if (res.length === 0) {
      newsSection.addNoEntityDOM('Новостей по тематике нет :(');
    }
    else {
      newsCardsList = new CardsList({});
      res.forEach((item) => {
        const cardData = dbCardTransform(item);
        const card = new Card(cardData);
        newsCardsList.addCard(card);
      });
      newsSection.setCardsList(newsCardsList);
      newsSection.createCards();
    }
    return res;
  })
  .catch((err) => {
    newsSection.getPreloaderComponentDOM().remove();
    newsSection.addErrorDOM(`Ошибка: ${err.message}`);
    return Promise.reject(err);
  })

}

/**
 * Формирует секцию сервиса Песочницы
 */
function makeSandBoxServiceSection() {
  sandBoxServiceSection = new SandBoxBuilder({
    calcFunction: calcSandBox,
  });
  sandBoxServiceSection.createDOM();
  contentSectionContainer.appendChild(sandBoxServiceSection.getDOM());
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
 * Обработчик меню Новости
 */
function onNews() {
  //brief.clear();
  clearContentContainer();
  makeNewsSection();
}


/**
 * Обработчик меню Песочница
 */
function onSandBox() {
  // while (contentSection.firstChild) {
  //   contentSection.removeChild(contentSection.firstChild);
  // }
  clearContentContainer();
  makeSandBoxServiceSection();
}

/**
 * Функция пересчета документа в Песочнице
 */
function calcSandBox(income, flows, outcome/*, calcMode*/) {

  //собираем входящий баланс
  const incomeSet = new AccountsSet();

  income.forEach(accObj => {
    const acc = new Account();
    acc.setAccNumber(accObj.accountNumber);
    acc.setOpenBalance({
      debet: accObj.debet,
      credit: accObj.credit,
    });
    acc.setDescription(accObj.note);

    incomeSet.add(acc);
  })

  //собираем обороты
  const flowsSet = new AccountingEntriesSet();
  flows.forEach(entryObj => {

    const entry = new AccountingEntry();
    entry.setName(entryObj.operationDesc);

    const accDebet = new Account();
    accDebet.setAccNumber(entryObj.debet)
    entry.setAccDebet(accDebet);

    const accCredit = new Account();
    accCredit.setAccNumber(entryObj.credit);
    entry.setAccCredit(accCredit);

    entry.setDescription(entryObj.note);
    entry.setSum(entryObj.summ);

    flowsSet.add(entry);

  })

  //собираем исходящие остатки
  const outcomeSet = new AccountsSet();

  outcome.forEach(accObj => {
    const acc = new Account();
    acc.setAccNumber(accObj.accountNumber);
    acc.setCloseBalance({
      debet: accObj.debet,
      credit: accObj.credit,
    });
    acc.setDescription(accObj.note);

    outcomeSet.add(acc);
  })

  //смотрим, что надо вычислять
  /*if (calcMode == 0) {

  }
  else if (calcMode == 1) {

  }
  else {

  }*/
}

/**
 * Удаляет содержимое контентного контейнера
 */
function clearContentContainer() {
  while (contentSectionContainer.firstChild) {
    contentSectionContainer.removeChild(contentSectionContainer.firstChild);
  }
}

/**
 * Трансформирует объект новости из БД в объект данных карточки новостей
 * @param {Object} объект новости из БД
 */
function dbCardTransform(dbObject) {
  return {
    url: dbObject.link,
    publishedAt: dbObject.date,
    keyWord: dbObject.keyword,
    urlToImage: dbObject.image,
    title: dbObject.title,
    description: dbObject.text,
    source: dbObject.source,
  };
}

/*----------------------------Обработчики событий--------------------------------*/

/**
 * загрузкa DOM
 * */
document.addEventListener('DOMContentLoaded', onLoadDOM);