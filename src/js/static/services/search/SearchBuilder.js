import Dialog from "../../../common/dialogs/Dialog";
import Properties from "../../../properties/Properties";
import ServiceBuilder from "../ServiceBuilder";

/**
 * Представление сервиса поиска тетрадок
 */

export default class SearchBuilder extends ServiceBuilder {

  _searchButton;
  _searchTextElement;
  _searchString;
  _searchTemplate;
  _searchResultsPanel;
  _searchFunction;
  _searchOptionsList = [];
  _searchField = null;

  constructor(props) {
    props.serviceName = 'Поиск';
    props.serviceDescription = 'Ищем тетрадки по запросу';
    super(props);
    this.setSearchString(this._props.searchString);
    this.setSearchTemplate(this._props.searchTemplate);
  }

  createDOM() {
    super.createDOM();
    this.createSearchPanel();
    this.createSearchResultsPanel(null);
    // this.setSearchField(Object.keys(this.getSearchTemplate())[0]);
    this.setActiveSearchListItem();
    this.setSearchButtonListener();
    this.setSearchEnterListener();
  }

  createSearchPanel() {
    this._centerContainer.insertAdjacentHTML('afterbegin', this._props.searchHTML);
    this._setUpSearchOptionsList();
    this._searchButton = this._componentDOM.querySelector('.search-section__button-search');
    this._searchTextElement = this._componentDOM.querySelector('.search-section__input-search');
    this._searchTextElement.value = this.getSearchString();
  }

  _setUpSearchOptionsList() {
    this._searchOptionsList = this._componentDOM.querySelectorAll('.search-section__link');
    this._searchOptionsList.forEach((item) => {
      item.addEventListener('click', () => {
        this._searchOptionsList.forEach((item) => {item.classList.remove('search-section__link_active')});
        item.classList.toggle('search-section__link_active');
        this.setSearchField(item.getAttribute('field'));
        this.setSearchString(this._searchTextElement.value);
        const searchObj = this.getSearchField() ? { [this.getSearchField()] : {$regex: `.*${''}.*`, $options: 'i'} } : null;
        this.setSearchTemplate(searchObj);
        this._execSearch();
     });
    });
  }

  createSearchResultsPanel(searchResult) {
    this._searchResultsPanel = this._props.searchResultsComponent;
    this._searchResultsPanel.setSearchString(this._searchTextElement.value);
    this._searchResultsPanel.setSearchResult(searchResult ? searchResult : []);
    this._searchResultsPanel.createDOM();
    this._componentDOM.insertAdjacentElement('beforeend', this._searchResultsPanel.getDOM());
  };

  setSearchButtonListener() {
    this._searchButton.addEventListener('click', () => {
      this._execSearch();
    });
  };

  setSearchEnterListener() {
    this._searchTextElement.addEventListener('keydown', this._enterEvent);
  }

  _execSearch = () => {
    let searchString = this._searchTextElement.value;
    if (!this.checkSearchString(searchString)) {
      Dialog.InfoDialog(`Уточните пожалуйста поисковый запрос.`);
      return;
    }

    this.setSearchString(searchString);

    if (this.getSearchField()) {
      this.getSearchTemplate()[this.getSearchField()] = {$regex: `.*${this.getSearchString()}.*`, $options: 'i', /*searchString: searchString*/};
    }
    else {
      this.setSearchTemplate(this.getSearchString());
    }

    this.search(this.getSearchTemplate());
  }

  search(searchTemplate) {

    this._searchResultsPanel.clearContent();
    this._searchResultsPanel.addPreloaderDOM('Минуточку...');

    this._props.searchFunction.call(this, this.getSearchTemplate())
    .then((docs) => {
      this._searchResultsPanel.getPreloaderComponentDOM().remove();
      if (docs.length > 0) {
        this._searchResultsPanel.clear();
        this.createSearchResultsPanel(docs);
      }
      else {
        this._searchResultsPanel.addNoEntityDOM('К сожалению ничего не найдено :(');
      }
    })
    .catch((err) => {
      this._searchResultsPanel.getPreloaderComponentDOM().remove();
      this._searchResultsPanel.addErrorDOM(err);
    });
  }

  getSearchFunction() {
    return this._searchFunction;
  }

  setSearchFunction(value) {
    this._searchFunction = value;
  }

  getSearchString() {
    return this._searchString;
  }

  setSearchString(value) {
    this._searchString = value ? value.trim() : value;
  }

  getSearchField() {
    return this._searchField;
  }

  setSearchField(value) {
    this._searchField = value;
  }

  getSearchTemplate() {
    return this._searchTemplate;
  }

  setSearchTemplate(value) {
    this._searchTemplate = value;
  }

  setActiveSearchListItem() {
    this._searchOptionsList.forEach((item) => {
      item.classList.remove('search-section__link_active');
      let atrr = item.getAttribute('field');
      if (atrr == this.getSearchField()) {
        item.classList.toggle('search-section__link_active');
      }
    });
  };

  /**
   * Обработчик enter
   * @param {Event} event
   */
   _enterEvent = (event) => {
    if (event.keyCode === 13) {
      this._execSearch();
      event.preventDefault();
    }
  }

  // Проверка корректности строки ввода
  checkSearchString(searchValue) {

    let searchString = searchValue.trim()
    const minlen = Properties.search.minchar;
    const maxlen = Properties.search.maxchar;
    if (! (searchString && (searchString.length >= minlen && searchString.length <= maxlen) ) ) {
      return false;
    }
    return true;
  }

}