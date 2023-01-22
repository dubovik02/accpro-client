import ServiceBuilder from "../ServiceBuilder";

/**
 * Представление сервиса поиска тетрадок
 */

export default class SearchBuilder extends ServiceBuilder {

  _searchButton;
  _searchTextElement;
  _searchString;
  _searchResultsPanel;
  _searchFunction;
  _searchObject;
  _searchOptionsList = [];

  constructor(props) {
    props.serviceName = 'Поиск';
    props.serviceDescription = 'Ищем тетрадки по запросу';
    super(props);
    this.setSearchFunction(this._props.searchFunction);
    this.setSearchObject(this._props.searchObject);
  }

  createDOM() {
    super.createDOM();
    this.createSearchPanel();
    this.createSearchResultsPanel(null);
    this.setSearchListener();
    this.setSearchEnterListener();
  }

  createSearchPanel() {
    this._centerContainer.insertAdjacentHTML('afterbegin', this._props.searchHTML);

    this._setUpSearchOptionsList();

    this._searchButton = this._componentDOM.querySelector('.search-section__button-search');

    this._searchTextElement = this._componentDOM.querySelector('.search-section__input-search');

    if (this._props.searchString) {
      this.setSearchString(this._props.searchString);
      this._searchTextElement.value = this.getSearchString();
    }
  }

  _setUpSearchOptionsList() {
    this._searchOptionsList = this._componentDOM.querySelectorAll('.search-section__link');
    this._searchOptionsList.forEach((item) => {
      item.addEventListener('click', () => {
        this._searchOptionsList.forEach((item) => {item.classList.remove('search-section__link_active')});
        item.classList.toggle('search-section__link_active');
        const searchField = item.getAttribute('field');
        this.setSearchString(this._searchTextElement.value);
        const searchObj = searchField ? { [searchField] : {$regex: `.*${this.getSearchString()}.*`, $options: 'i'} } : null;
        this.setSearchObject(searchObj);
        this._execSearch();
     });
    });
  }

  createSearchResultsPanel(searchResult) {
    this._searchResultsPanel = this._props.searchResultsComponent;
    this._searchResultsPanel.setSearchString(this.getSearchString());
    this._searchResultsPanel.setSearchResult(searchResult ? searchResult : []);
    this._searchResultsPanel.createDOM();
    this._componentDOM.insertAdjacentElement('beforeend', this._searchResultsPanel.getDOM());
  };

  setSearchListener() {
    this._searchButton.addEventListener('click', () => {
      this._execSearch();
    });
  };

  setSearchEnterListener() {
    this._searchTextElement.addEventListener('keydown', this._enterEvent);
  }

  _execSearch = () => {
    this.setSearchString(this._searchTextElement.value);
    if (this.getSearchString()) {
      this.search(this.getSearchString(), this.getSearchObject());
    }
  }

  search(searchString, searchObject) {
    this._searchResultsPanel.clearContent();
    this._searchResultsPanel.addPreloaderDOM('Минуточку...');

    this._props.searchFunction.call(this, searchString, searchObject)
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
    this._searchString = value.trim();
  }

  setSearchObject(value) {
    this._searchObject = value;
  }

  getSearchObject() {
    return this._searchObject;
  }

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

}