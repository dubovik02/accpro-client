import AccComponent from "../common/AccComponent";
import issueIco from '../../images/issue256.png';
import ideaIco from '../../images/idea256.png';
// import flowsImg from '../../images/brief_flows.png';
// import accImg from '../../images/account_w.jpg';
import shareIco from '../../images/paper-plane256.png';
import Dialog from "../common/dialogs/Dialog";
import Properties from "../properties/Properties";

export default class BriefBuilder extends AccComponent {

  /**
   * Кнопка регистрации
   */
  _buttonSignUp;

  /**
   * Поиск
   */
  _buttonSearch;

  /**
   * Строка поиска
   */
  _searchElement;

  /**
   * Набор топ-хэштегов  */
  _popularTags = [];

  /**
   * Коллбэк для функии регистрации
   */
  _signUpFunction;

  /**
   * Колбэк для функции поиска
   */
  _searchFunction;

  /**
   * Колбэк получения списка топ-хэштегов
   */
  _getTagsFunction

  /**
   * Колбэк для функции поиска по топ1-хэштэгам
   */
  _topTagsFunction;

  // контейнер для тэгов
  _tagsContainer;

  //Секция представления библиотеки
  //_librarySection;

  constructor(prop) {
    super(prop);
    this._signUpFunction = this._props.signUpFunction;
    this._searchFunction = this._props.searchFunction;
    this._topTagsFunction = this._props.topTagsFunction;
  }

  createDOM() {
    this._componentDOM = document.createElement('section');
    this._componentDOM.classList.add('brief-section');

    const briefHtml = `<div class="brief">
                        <h1 class="brief__title">${Properties.lang.dict.main.briefTitle}</h1>
                        <p class="brief__text">${Properties.lang.dict.main.briefSubTitle}</p>
                        ${this._props.searchHTML}
                        <!--<button class="button brief__button-registration">Регистрация</button>-->
                        <div class="brief__tags-container">

                        </div>

                      </div>

                      <div class="info-section">
                        <p class="info-section__title">${Properties.lang.dict.main.libraryTitle}</p>
                        <div class="info-section__card-container">
                          <div class="info-card">
                            <img class="info-card__icon" src="${issueIco}" alt="вопрос">
                            <p class="info-card__title">${Properties.lang.dict.main.librarySearch}</p>
                            <p class="info-card__text">${Properties.lang.dict.main.libraryText}</p>
                          </div>
                          <div class="info-card">
                            <img class="info-card__icon" src="${ideaIco}" alt="решение">
                            <p class="info-card__title">${Properties.lang.dict.main.librarySuggest}</p>
                            <p class="info-card__text">${Properties.lang.dict.main.librarySuggestText}</p>
                          </div>
                          <div class="info-card">
                            <img class="info-card__icon" src="${shareIco}" alt="поделиться">
                            <p class="info-card__title">${Properties.lang.dict.main.libraryShare}</p>
                            <p class="info-card__text">${Properties.lang.dict.main.libraryShareText}</p>
                          </div>
                        </div>
                      </div>

                      <div class="info-section info-section_background-black">
                        <p class="info-section__title info-section_title-white">${Properties.lang.dict.main.accountTitle}</p>
                        <div class="info-section__row-container">
                          <img class="info-section__image info-section__image_small-size" src="${Properties.lang.dict.pictures.account}" alt="счет">
                          <div class="info-section__text-container">
                            <p class="info-section__text info-section_text-white">
                              ${Properties.lang.dict.main.accountP1}
                            </p>
                            <p class="info-section__text info-section_text-white">
                              ${Properties.lang.dict.main.accountP2}
                            </p>
                            <p class="info-section__text info-section_text-white">
                              ${Properties.lang.dict.main.accountP3}
                            </p>
                            <p class="info-section__text info-section_text-white">
                              ${Properties.lang.dict.main.accountP4}
                            </p>
                            <p class="info-section__text info-section_text-white">
                              ${Properties.lang.dict.main.accountP5}
                            </p>
                            <p class="info-section__text info-section_text-white">
                              ${Properties.lang.dict.main.accountP6}
                            </p>
                            <p class="info-section__text info-section_text-white">
                              ${Properties.lang.dict.main.accountP7}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="info-section">
                        <p class="info-section__title">${Properties.lang.dict.main.doubleEntryTitle}</p>
                        <div class="info-section__row-container">
                          <img class="info-section__image info-section__image_large-size" src="${Properties.lang.dict.pictures.flows}" alt="поделиться">
                          <div class="info-section__text-container">
                            <p class="info-section__text">
                              ${Properties.lang.dict.main.doubleEntryP1}
                            </p>
                            <p class="info-section__text">
                              ${Properties.lang.dict.main.doubleEntryP2}
                            </p>
                            <p class="info-section__text">
                              ${Properties.lang.dict.main.doubleEntryP3}
                            </p>
                            <p class="info-section__text">
                              ${Properties.lang.dict.main.doubleEntryP4}
                            </p>
                            <p class="info-section__text">
                              ${Properties.lang.dict.main.doubleEntryP5}
                            </p>
                          </div>
                        </div>
                      </div>
                      `;

    this._componentDOM.insertAdjacentHTML('afterbegin', briefHtml);
    this._buttonSignUp = this._componentDOM.querySelector('.brief__button-registration');
    this._buttonSearch = this._componentDOM.querySelector('.search-section__button-search');
    this._searchElement = this._componentDOM.querySelector('.search-section__input-search');
    this._tagsContainer = this._componentDOM.querySelector('.brief__tags-container');
    this._loadPopularTagsList();
    this._setListeners();

  }

  _setListeners() {
    this._setSignUpListener();
    this._setSearchListener();
    this._setSearchEnterListener();
  }

  _setSignUpListener(){
    if (this._buttonSignUp instanceof Element) {
      this._buttonSignUp.addEventListener('click', () => {
        if (this._signUpFunction instanceof Function) {
          this._signUpFunction.call(this, []);
        }
      })
    }
  }

  _setSearchListener(){
    if (this._buttonSearch instanceof Element) {
      this._buttonSearch.addEventListener('click', () => {
        if (this._searchFunction instanceof Function) {
          this._buttonSearch.blur();
          this._search();
        }
      })
    }
  }

  _setSearchEnterListener() {
    this._searchElement.addEventListener('keydown', this._enterEvent);
  }

  _search = () => {
    let searchString = this._searchElement.value;
    searchString = searchString.trim();
    const minlen = Properties.search.minchar;
    const maxlen = Properties.search.maxchar;
    if ((searchString.length < minlen) || (searchString.length > maxlen)) {
      Dialog.InfoDialog(`${Properties.lang.dict.dialogs.searchWordLimit}: (${minlen} - ${maxlen}).`);
    }
    else {
      this._searchFunction.call(this, searchString, searchString);
    }
  }

  getButtonSignUp() {
    return this._buttonSignUp;
  }

  _loadPopularTagsList() {
    this._popularTags = [];
    this._topTagsFunction.call(this)
    .then((tags) => {
      tags.forEach((item) => {
        const tagHtml = `<p class="button brief__tags-text brief__tags-text-${item._id}">${item._id}</p>`;
        this._tagsContainer.insertAdjacentHTML('beforeend', tagHtml);
        const tagElem = this._tagsContainer.querySelector(`.brief__tags-text-${item._id}`);
        tagElem.addEventListener('click', () => {
          this._searchFunction.call(this, item._id, {'properties.tags': {$regex: `.*${item._id}.*`, $options: 'i'}, });
        });
      });

    })
    .catch((err) => {
      Dialog.ErrorDialog(`${Properties.lang.dict.dialogs.hashTagsError}: ${err}`);
    })
  }

  /**
   * Обработчик enter
   * @param {Event} event
   */
   _enterEvent = (event) => {
    if (event.keyCode === 13) {
      this._search();
      event.preventDefault();
    }
  }

}