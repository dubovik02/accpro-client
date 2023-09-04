import AccComponent from "../common/AccComponent";
import issueIco from '../../images/issue256.png';
import ideaIco from '../../images/idea256.png';
import solutionIco from '../../images/solution256.png';
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
    //this._librarySection = this._props.librarySection;
  }

  createDOM() {
    this._componentDOM = document.createElement('section');
    this._componentDOM.classList.add('brief-section');

    const briefHtml = `<div class="brief">
                        <h1 class="brief__title">Открытая библиотека бухгалтерских проводок</h1>
                        <p class="brief__text">Находите, предлагайте, делитесь</p>
                        ${this._props.searchHTML}
                        <!--<button class="button brief__button-registration">Регистрация</button>-->
                        <div class="brief__tags-container">

                        </div>

                      </div>

                      <!--div class="info-section">
                        <p class="info-section__title">Популярные публикации</p>
                        <div class="info-section__card-container">
                          <div class="info-card">
                            <img class="info-card__icon" src="${issueIco}" alt="вопрос">
                            <p class="info-card__title">Дебет или кредит?</p>
                          </div>
                          <div class="info-card">
                            <img class="info-card__icon" src="${ideaIco}" alt="идея">
                            <p class="info-card__title">Есть идея!</p>
                          </div>
                          <div class="info-card">
                            <img class="info-card__icon" src="${solutionIco}" alt="решение">
                            <p class="info-card__title">Решаем!</p>
                          </div>
                          <div class="info-card">
                            <img class="info-card__icon" src="${shareIco}" alt="поделиться">
                            <p class="info-card__title">Делимся!</p>
                          </div>
                        </div>
                      </div--!>
                      `;

    this._componentDOM.insertAdjacentHTML('afterbegin', briefHtml);
    this._buttonSignUp = this._componentDOM.querySelector('.brief__button-registration');
    this._buttonSearch = this._componentDOM.querySelector('.search-section__button-search');
    this._searchElement = this._componentDOM.querySelector('.search-section__input-search');
    this._tagsContainer = this._componentDOM.querySelector('.brief__tags-container');
    this._loadPopularTagsList();
    //this.createLibrarySection();
    this._setListeners();

  }

  // createLibrarySection() {
  //   this._librarySection.createDOM();
  //   this._componentDOM.insertAdjacentElement('beforeend', this._librarySection.getDOM());
  // };

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
      Dialog.InfoDialog(`Поисковый запрос должен содержать от ${minlen} до ${maxlen} символов.`);
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
          this._searchFunction.call(this, item._id, {'properties.tags': {$regex: `.*${item._id}.*`, $options: 'i'}, /*searchString: `${item._id}`*/ });
        });
      });

    })
    .catch((err) => {
      Dialog.ErrorDialog(`Ошибка при получении хэштэгов: ${err}`);
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