import AccComponent from "../../../common/AccComponent";
import like from "../../../../images/like32.png"
import view from "../../../../images/view64.png";
import Properties from "../../../properties/Properties";
import issueIco from '../../../../images/issue256.png';

/**
 * Класс представления результатов поиска
*/
export default class SearchResultsPanel extends AccComponent {

  _searchString : string;
  _searchResult : Array<{ [key: string]: any }> = [];

  _idClassPrefix : string = 'item-';

  _showTitle : string = `${Properties.lang.dict.searchPanel.additional}`;
  _hideTitle : string = `${Properties.lang.dict.searchPanel.hide}`;

  constructor(props : { [key: string]: any }) {
    super(props);
  }

  createDOM() {
    this._componentDOM = document.createElement('service-section');
    this._componentDOM.classList.add('service-section');
    this._componentDOM.insertAdjacentElement('beforeend', this._createSearchResultElement());
  }

  //создает представление результатов поиска
  _createSearchResultElement() {

    let componentHTML = '';
    // если ни чего не искали - и не выводим результаты
    if (this.getSearchString() || this.getSearchResult().length) {
      componentHTML = `
                      <div class="service-section__container">
                        <p class="service-section__description">
                          ${Properties.lang.dict.searchPanel.found}:
                          <span class="service-section__span">${this.getSearchResult().length} ${Properties.lang.dict.searchPanel.results}</span>
                          ${Properties.lang.dict.searchPanel.byquery}:
                          <span class="service-section__span">${this.getSearchString()}</span>
                        </p>

                      </div>
                      `;
    }
    else {
      componentHTML = `
                      <div class="service-section__icon-container service-section__icon-container_center">
                        <img class="service-section__icon service-section__icon_256" src="${issueIco}" alt="вопрос">
                      </div>
                      `;
    }
    this._componentDOM.insertAdjacentHTML('afterbegin', componentHTML);

    const resultElement = document.createElement('div');
    resultElement.classList.add('search-section');

    if (!this.getSearchResult().length) {
      return resultElement;
    }

    this.getSearchResult().forEach((item) => {
      const itemHTML = this._createSearchedItemHTML(item);
      resultElement.insertAdjacentHTML('beforeend', itemHTML);

      const itemElem = resultElement.querySelector(`.${this._idClassPrefix}${item._id}`);
      const descLink = resultElement.querySelector(`.description-link${item._id}`);
      const descText = resultElement.querySelector(`.description-text${item._id}`);

      // показываем/скрываем описание
      descLink.addEventListener('click', (event) => {
        descText.classList.toggle('service-section__description_not-visible');
        descLink.textContent = descLink.textContent === this._showTitle ? this._hideTitle : this._showTitle;
        event.stopPropagation();
      });

      //по клику открываем документ
      itemElem.addEventListener('click', (event) => {
        window.open(`http://${Properties.site.host}/?id=${item._id}`, '_blank');
        event.stopPropagation();
      });
    });

    return resultElement;
  }

  //формирует html-представление для списка найденных документов
  _createSearchedItemHTML(item : { [key: string]: any }) {
    return `
            <div class="search-section__item-container">
              <p class="service-section__description">
              ${Properties.lang.dict.notebook.notebook}:
                <span class="service-section__span service-section__span_file-description file-name ${this._idClassPrefix}${item._id}">${item._id}</span>
              </p>

              <p class="service-section__description">
                ${Properties.lang.dict.notebook.create}:
                <span class="service-section__span file-date">${new Date(item.lastupdate).toLocaleString()}</span>
              </p>

              <p class="service-section__description">
                ${Properties.lang.dict.notebook.name}:
                <span class="service-section__span">${item.properties.shortdesc}</span>
              </p>

              <p class="service-section__description">
                ${Properties.lang.dict.notebook.hashtags}:
                <span class="service-section__span">${item.properties.tags}</span>
              </p>

              <p class="service-section__description">
                ${Properties.lang.dict.notebook.description}:
                <span class="service-section__span service-section__span_file-description description-link${item._id}">${this._showTitle}</span>
                <p class="service-section__description service-section__description_not-visible description-text${item._id}">${item.properties.description}</p>
              </p>

              <div class="service-section__icon-container">
                <div class="service-section__icon-container">
                  <img class="service-section__icon like" src="${like}">
                  <span class="service-section__span likes-counter">${item.likes.length}</span>
                </div>
                <div class="service-section__icon-container">
                  <img class="service-section__icon" src="${view}">
                  <span class="service-section__span views-counter">${item.views}</span>
                </div>
              </div>

            </div>
            `;
  }

  getSearchString() {
    return this._searchString;
  }
  setSearchString(value : string) {
    this._searchString = value;
  }

  getSearchResult() {
    return this._searchResult;
  }
  setSearchResult(value : Array<{ [key: string]: any } >) {
    this._searchResult = value;
  }

}