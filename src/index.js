import './style.css';
import HeaderBuilder from './js/static/HeaderBuilder';
import FooterBuilder from './js/static/FooterBuilder';
import Properties from './js/properties/Properties';
import Api from './js/api/Api';
import BriefBuilder from './js/static/BriefBuilder';
import FormsFactory from './js/common/factories/FormsFactory';
import SignUpPopUp from './js/static/popups/SignUpPopUp';
import FormInputsValidator from './js/validators/FormInputsValidator';
import SignInPopUp from './js/static/popups/SignInPopUp';
import AccComponent from './js/common/AccComponent';
import SandBoxBuilder from './js/static/services/sandbox/SandBoxBuilder';
import SandBoxProvider from './js/static/services/sandbox/SandBoxProvider';
import ComponentsFactory from "./js/common/factories/ComponentsFactory";
import SearchBuilder from './js/static/services/search/SearchBuilder';
import SearchProvider from './js/static/services/search/SearchProvider';
import SearchResultsPanel from './js/static/services/search/SearchResultsPanel';
import LibraryBuilder from './js/static/services/library/LibraryBuilder';

/*-------------Переменные----------------*/
const page = document.querySelector('.page');
const contentSection = document.querySelector('.content');
const contentSectionContainer = document.querySelector('.content-container');

/*-Api-*/
const api = new Api(Properties.connection.accapi.url, localStorage.getItem('jwt'));

/*-Число тэгов для отображения-*/
const topTagsCount = Properties.search.maxTopTagsCount;

/*-Header-*/
let header;

/*-Бриф-*/
let brief;

/*-Песочница-*/
let sandBoxServiceSection;
let sandBoxProvider;

/*-Поиск-*/
let searchBuilder;
let searchProvider;
let searchResultPanel;

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

  const params = new URLSearchParams(document.location.search);
  const reqId = params.get('id');
  //если есть ссылка на конкретный документ, открываем его
  if (reqId) {
    makeSandBoxServiceSection(reqId);
  }
  else {
    makeBriefSection();
  }
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
        main: onMain,
        //news: onNews,
        sandBox: onSandBox,
        search: onSearch,
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
    brief = new BriefBuilder({
      searchHTML: new ComponentsFactory().getSearchFormHTML(),
      searchFunction: searchSbDoc,
      topTagsFunction: loadTopTags,///////////////
      librarySection: new LibraryBuilder({}),//////////////////
    });
    brief.createDOM();

    popupSignUp = new SignUpPopUp({
      title: 'Регистрация пользователя',
      butOpen: brief.getButtonSignUp(),
      form: new FormsFactory().createSignUpForm('signup'),
      submitFunction: signUp,
      signInFunction: showSignInPopup,
    });

    const validator = new FormInputsValidator(popupSignUp.getForm(), Properties.popupErrMsg);
    contentSectionContainer.appendChild(brief.getDOM());
}

/**
 * Формирует секцию сервиса Песочницы
 */
function makeSandBoxServiceSection(reqId) {
  if (!sandBoxProvider) {
    sandBoxProvider = new SandBoxProvider({
      api: api,
    });
  }

  if (!sandBoxServiceSection) {
    sandBoxServiceSection = new SandBoxBuilder({
      calcFunction: sandBoxProvider.calcSandBox,
      saveFunction: sandBoxProvider.saveSandBox,
      loginFunction: showSignInPopup,
      preloader: new ComponentsFactory().createPreloader('Минуточку ...'),
      openSBFunction: sandBoxProvider.openSandBoxDialog,
      newSBFunction: sandBoxProvider.newSandBox,
      fileContentFunction: sandBoxProvider.openUpdateFileContentDialog,
      shareFunction: sandBoxProvider.createShareLink,
      createAndShowShareLink: sandBoxProvider.createAndShowShareLink,
      likeFunction: sandBoxProvider.like,
      cellEditingFunction: sandBoxProvider.synchronizeModel,
    });

    sandBoxProvider.setServiceBuilder(sandBoxServiceSection);
    sandBoxServiceSection.createDOM();
    if (reqId) {//подгружаем запрашиваемый
      const isViewed = localStorage.getItem(reqId) ? true : false;
      if (!isViewed) {
        localStorage.setItem(`${reqId}`, true);
      }
      sandBoxProvider._openShareSandBox(reqId, isViewed);
    }
    else {//подгружаем пустой документ
      sandBoxProvider.newSandBox();
    }
  }
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
      localStorage.setItem('userId', res.id);
      makeHeader();
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
 * Обработчик меню Главная
 */
 function onMain() {
  clearContentContainer();
  makeBriefSection();
}

/**
 * Обработчик меню Песочница
 */
function onSandBox() {
  clearContentContainer();
  makeSandBoxServiceSection();
}

/**
 * Обработчик меню Поиск
 */
 function onSearch() {
  clearContentContainer();
  makeSearchSection(null, null);
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
 * Поиск тетрадки по запросу
 * @param {String} searchString поисковая строка
 */
function searchSbDoc(searchString, searchObject) {
  clearContentContainer();
  makeSearchSection(searchString, searchObject);
  header.setActiveMenuItem(header.getMenuItemSearch());
}

function makeSearchSection(searchString, searchObject) {
  if (!searchProvider) {
    searchProvider = new SearchProvider({
      api: api,
    });
  }

  searchResultPanel = new SearchResultsPanel({
  });

  searchBuilder = new SearchBuilder({
    searchHTML: new ComponentsFactory().getAdvancedSearchFormHTML(),
    searchString: searchString,
    searchResultsComponent: searchResultPanel,
    searchFunction: searchProvider.search,
    searchObject: searchObject,
  });

  searchProvider.setServiceBuilder(searchBuilder);
  searchBuilder.createDOM();
  contentSectionContainer.appendChild(searchBuilder.getDOM());
  if (!(!searchString && !searchObject)) {//если что-то ищем
    searchBuilder.search(searchBuilder.getSearchString(), searchObject);
  }
}

function loadTopTags() {
  return api.getTopTags(topTagsCount);
}

/*----------------------------Обработчики событий--------------------------------*/

/**
 * загрузкa DOM
 * */
document.addEventListener('DOMContentLoaded', onLoadDOM);