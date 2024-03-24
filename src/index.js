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
import RestorePopUp from './js/static/popups/RestorePopUp';
import Dialog from './js/common/dialogs/Dialog';
import NewPasswordPopUp from './js/static/popups/NewPasswordPopUp';
import rusDict from './js/languages/rus';
import engDict from './js/languages/eng';

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
/*-Запрос восстановлениие пароля-*/
let popupRestore;
/*-Восстановление пароля-*/
let popUpNewPassword;

/*-текущий словарь-*/
let currentDictionary;

/*-разделы-*/
const MAIN_PAGE = 0;
const SEARCH_PAGE = 1;
const SANDBOX_PAGE = 2;

/*-текущий активный раздел-*/
let activePage = MAIN_PAGE;

/*-------------Функции-------------------*/
/**
 * Общая процедура, вызываемая при загрузки страницы
 */
function onLoadDOM() {

  let dict;
  if (navigator.language.toLowerCase() == 'ru-ru') {
    dict = rusDict;
  }
  else {
    dict = engDict;
  }
  setCurrentDictionary(dict);

  makeHeader();

  const params = new URLSearchParams(document.location.search);
  const reqId = params.get('id');//запрос документа
  const userKey = params.get('key');//запрос восстановления доступа
  const userEmail = params.get('email');

  if (!reqId && !userKey) {
    makeBriefSection();
  }
  else {
    if (reqId) {
      makeSandBoxServiceSection(reqId);
      activePage = SANDBOX_PAGE;
    }
    if (userKey) {
      makeBriefSection();
      localStorage.setItem('userKey', userKey);
      localStorage.setItem('userEmail', userEmail);
      showNewPasswordPopup();
    }
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
    header.getButtonLogin().addEventListener('click', logout);
  }

  header.getLangButton().addEventListener('click', toggleDictionary);

  popupSignIn = new SignInPopUp({
    title: `${Properties.lang.dict.popups.signinTitle}`,
    butOpen: isLoggedIn !== null ? null : header.getButtonLogin(),
    form: new FormsFactory().createSignInForm('signin'),
    submitFunction: signIn,
    signUpFunction: showSignUpPopup,
    restoreFunction: showRestorePopup,
  });
  const validatorSignIn = new FormInputsValidator(popupSignIn.getForm(), Properties.lang.dict.errors);

  popupSignUp = new SignUpPopUp({
    title: `${Properties.lang.dict.popups.signupTitle}`,
    // butOpen: brief.getButtonSignUp(),
    form: new FormsFactory().createSignUpForm('signup'),
    submitFunction: signUp,
    signInFunction: showSignInPopup,
  });
  const validatorSignUp = new FormInputsValidator(popupSignUp.getForm(), Properties.lang.dict.errors);

  popupRestore = new RestorePopUp({
    title: `${Properties.lang.dict.popups.restorePassTitle}`,
    form: new FormsFactory().createRestoreForm('restore'),
    signUpFunction: showSignUpPopup,
    submitFunction: restorePassword,
    afterCloseDialogFunction: () => {Dialog.InfoDialog(
      `${Properties.lang.dict.promts.sendRestorePass} ${localStorage.getItem('userEmail')}`)},
  });
  const validatorRestore = new FormInputsValidator(popupRestore.getForm(), Properties.lang.dict.errors);

  popUpNewPassword = new NewPasswordPopUp({
    title: 'Восстановление пароля',
    form: new FormsFactory().createNewPasswordForm('newpassword'),
    submitFunction: changeUserPassword,
    afterCloseDialogFunction: () => {
      Dialog.InfoDialog(`${Properties.lang.dict.promts.newPassChanged} ${localStorage.getItem('userEmail')}.`);
    },
  });
  const validatorNewPassword = new FormInputsValidator(popUpNewPassword.getForm(), Properties.lang.dict.errors);

  contentSection.insertAdjacentElement('afterbegin', header.getDOM());
}

/**
 * Формирует brief-секцию
 */
function makeBriefSection() {
    brief = new BriefBuilder({
      searchHTML: new ComponentsFactory().getSearchFormHTML(),
      searchFunction: searchSbDoc,
      topTagsFunction: loadTopTags,
    });
    brief.createDOM();
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

  sandBoxServiceSection = new SandBoxBuilder({
    calcFunction: sandBoxProvider.calcSandBox,
    saveFunction: sandBoxProvider.saveSandBox,
    saveCopyFunction: sandBoxProvider.saveSandBoxCopy,
    printFunction: sandBoxProvider.printSandBox,
    loginFunction: showSignInPopup,
    preloader: new ComponentsFactory().createPreloader(`${Properties.lang.dict.dialogs.waitPlease}`),
    openSBFunction: sandBoxProvider.openSandBoxDialog,
    newSBFunction: sandBoxProvider.newSandBox,
    fileContentFunction: sandBoxProvider.openUpdateFileContentDialog,
    shareFunction: sandBoxProvider.createShareLink,
    createAndShowShareLink: sandBoxProvider.createAndShowShareLink,
    likeFunction: sandBoxProvider.like,
    cellEditingFunction: sandBoxProvider.synchronizeModel,
    checkModelFunction: sandBoxProvider.checkModel,
  });

  sandBoxProvider.setServiceBuilder(sandBoxServiceSection);
  sandBoxServiceSection.createDOM();
  contentSectionContainer.appendChild(sandBoxServiceSection.getDOM());
  if (reqId) {//подгружаем запрашиваемый
    const isViewed = localStorage.getItem(reqId) ? true : false;
    if (!isViewed) {
      localStorage.setItem(`${reqId}`, true);
    }
    sandBoxProvider._openShareSandBox(reqId, isViewed);
  }
  else {// если есть активный документ - подгружаем его
    if (sandBoxProvider.getCurrentDocument()) {
      sandBoxProvider.loadCurrentDocument();
    }
    else {//подгружаем пустой документ
      sandBoxProvider.newSandBox();
    }
  }

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
 * запроос восстановления пароля
 */
function restorePassword(params) {
  return api.restorePassword(params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

/**
 * Смена пароля
 */
function changeUserPassword(obj) {
  const params = {
    key: localStorage.getItem('userKey'),
    email: localStorage.getItem('userEmail'),
    password: obj.newPass,
  };
  return api.updateUserPassword(params)
    .then((res) => {
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
 * установка текущего словаря
 */
function setCurrentDictionary(dict) {
  currentDictionary = dict;
  Properties.lang.dict = currentDictionary;
}

/**
 * Переключение словаря
 */
function toggleDictionary() {
  if (currentDictionary == rusDict) {
    setCurrentDictionary(engDict);
  }
  else {
    setCurrentDictionary(rusDict);
  }

  makeHeader();

  switch (activePage) {
    case MAIN_PAGE:
      onMain();
      break;
    case SEARCH_PAGE:
      onSearch();
      break;
    case SANDBOX_PAGE:
      onSandBox();
      break;
    default:
      onMain();
  }

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
 * Показывает попап запроса восстановления пароля
 */
function showRestorePopup() {
  popupRestore.open();
}

/**
 * Показывает попап восстановления пароля
 */
function showNewPasswordPopup() {
  popUpNewPassword.open();
}

/**
 * Обработчик меню Главная
 */
 function onMain() {
  clearContentContainer();
  makeBriefSection();
  activePage = MAIN_PAGE;
}

/**
 * Обработчик меню Поиск
 */
 function onSearch() {
  clearContentContainer();
  makeSearchSection(null, null);
  activePage = SEARCH_PAGE;
}

/**
 * Обработчик меню Песочница
 */
function onSandBox() {
  clearContentContainer();
  makeSandBoxServiceSection();
  activePage = SANDBOX_PAGE;
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
 */
function searchSbDoc(searchString, searchTemplate) {
  clearContentContainer();
  makeSearchSection(searchString, searchTemplate);
  header.setActiveMenuItem(header.getMenuItemSearch());
}

function makeSearchSection(searchString, searchTemplate) {

  if (!searchProvider) {
    searchProvider = new SearchProvider({
      api: api,
    });
  }

  searchResultPanel = new SearchResultsPanel({
  });

  searchBuilder = new SearchBuilder({
    searchHTML: new ComponentsFactory().getAdvancedSearchFormHTML(),
    searchResultsComponent: searchResultPanel,
    searchFunction: searchProvider.search,
    searchString: searchString,
    searchTemplate: searchTemplate,
  });

  searchProvider.setServiceBuilder(searchBuilder);
  searchBuilder.createDOM();
  contentSectionContainer.appendChild(searchBuilder.getDOM());
  if (searchTemplate) {//если что-то ищем
    searchBuilder.search(searchTemplate);
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