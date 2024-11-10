import Dialog from "../../../common/dialogs/Dialog";
import Properties from "../../../properties/Properties";
import ServiceBuilder from "../ServiceBuilder";
import SearchResultsPanel from "./SearchResultsPanel";

/**
 * Представление сервиса поиска тетрадок
 */

export default class SearchBuilder extends ServiceBuilder {

  _searchButton : HTMLButtonElement;
  _searchTextElement : HTMLInputElement;
  _searchString : string;
  _searchTemplate : { [key: string]: any };
  _searchResultsPanel : SearchResultsPanel;
  _searchFunction : Function;
  _searchOptionsList : NodeListOf<HTMLElement>;
  _searchField : string = null;

  constructor(props : { [key: string]: any }) {
    props.serviceName = `${Properties.lang.dict.search.searchTitle}`;
    props.serviceDescription = `${Properties.lang.dict.search.searchSubTitle}`;
    super(props);
    this.setSearchString(this._props.searchString);
    this.setSearchTemplate(this._props.searchTemplate);
  }

  createDOM() {
    super.createDOM();
    this.createSearchPanel();
    this.createSearchResultsPanel(null);
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

  createSearchResultsPanel(searchResult : Array<{ [key: string]: any }>) {
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
      Dialog.InfoDialog(`${Properties.lang.dict.dialogs.enterSearchQuery}`);
      return;
    }

    this.setSearchString(searchString);

    if (this.getSearchField()) {//ищемм по шаблону
      this.getSearchTemplate()[this.getSearchField()] = {$regex: `.*${this.getSearchString()}.*`, $options: 'i', };
    }
    else {//если не по шаблону - ищем полнотекстово
      this.setSearchTemplate(null);
    }

    this.search();
  }

  search() {

    this._searchResultsPanel.clearContent();
    this._searchResultsPanel.addPreloaderDOM(`${Properties.lang.dict.dialogs.waitPlease}`);

    this._props.searchFunction.call(this, this.getSearchString(), this.getSearchTemplate())
    .then((docs : any) => {
      this._searchResultsPanel.getPreloaderComponentDOM().remove();
      if (docs.length > 0) {
        this._searchResultsPanel.clear();
        this.createSearchResultsPanel(docs);
      }
      else {
        this._searchResultsPanel.addNoEntityDOM(`${Properties.lang.dict.search.noSearchResult}`);
      }
    })
    .catch((err : any) => {
      this._searchResultsPanel.getPreloaderComponentDOM().remove();
      this._searchResultsPanel.addErrorDOM(err);
    });
  }

  getSearchFunction() {
    return this._searchFunction;
  }

  setSearchFunction(value : Function) {
    this._searchFunction = value;
  }

  getSearchString() {
    return this._searchString;
  }

  setSearchString(value : string) {
    this._searchString = value ? value.trim() : value;
  }

  getSearchField() {
    return this._searchField;
  }

  setSearchField(value : string) {
    this._searchField = value;
  }

  getSearchTemplate() {
    return this._searchTemplate;
  }

  setSearchTemplate(value : { [key: string]: any }) {
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
   _enterEvent = (event : KeyboardEvent) => {
    if (event.key === 'Enter') {
      this._execSearch();
      event.preventDefault();
    }
  }

  // Проверка корректности строки ввода
  checkSearchString(searchStr : string) {

    let searchString = searchStr.trim()
    const minlen = Properties.search.minchar;
    const maxlen = Properties.search.maxchar;
    if (! (searchString && (searchString.length >= minlen && searchString.length <= maxlen) ) ) {
      return false;
    }
    return true;
  }

}