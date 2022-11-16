import AccComponent from "../../../common/AccComponent";
import like from "../../../../images/like32.png"
import view from "../../../../images/view64.png";
import Properties from "../../../properties/Properties";
import issueIco from '../../../../images/issue256.png';

/**
 * Класс представления результатов поиска
*/
export default class SearchResultsPanel extends AccComponent {

  _searchString;
  _searchResult = [];

  _idClassPrefix = 'item-';

  constructor(props) {
    super(props);
  }

  createDOM() {
    this._componentDOM = document.createElement('service-section');
    this._componentDOM.classList.add('service-section');

    // const componentHTML = '';

    // if (this.getSearchString() && this.getSearchResult().length) {
    //   componentHTML = `
    //                   <div class="service-section__container">
    //                     <p class="service-section__description">
    //                       Найдено:
    //                       <span class="service-section__span">${this.getSearchResult().length} результата(ов)</span>
    //                       по запросу:
    //                       <span class="service-section__span">${this.getSearchString()}</span>
    //                     </p>

    //                   </div>
    //                   `;
    // }
    // const componentHTML = `
    //                   <div class="service-section__container">
    //                     <p class="service-section__description">
    //                       Найдено:
    //                       <span class="service-section__span">${this.getSearchResult().length} результата(ов)</span>
    //                       по запросу:
    //                       <span class="service-section__span">${this.getSearchString()}</span>
    //                     </p>

    //                   </div>
    //                   `;

    // this._componentDOM.insertAdjacentHTML('afterbegin', componentHTML);
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
                          Найдено:
                          <span class="service-section__span">${this.getSearchResult().length} результата(ов)</span>
                          по запросу:
                          <span class="service-section__span">${this.getSearchString()}</span>
                        </p>

                      </div>
                      `;
    }
    else {
      componentHTML = `
                      <div class="service-section__container">
                        <img class="info-card__icon" src="${issueIco}" alt="вопрос">
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

      itemElem.addEventListener('click', (event) => {
        window.open(`http://${Properties.site.host}/?id=${item._id}`, '_blank');
        event.preventDefault();
      });
    });

    return resultElement;
  }

  //формирует html-представление для списка найденных документов
  _createSearchedItemHTML(item) {
    return `
            <div class="search-section__item-container ${this._idClassPrefix}${item._id}">
              <p class="service-section__description">
                Тетрадь:
                <span class="service-section__span file-name">${item._id}</span>
              </p>

              <p class="service-section__description">
                Создана(изменена):
                <span class="service-section__span file-date">${new Date(item.lastupdate).toLocaleString()}</span>
              </p>

              <p class="service-section__description">
                Название:
                <span class="service-section__span service-section__span_file-description description">${item.properties.shortdesc}</span>
              </p>

              <p class="service-section__description">
                Хэш-теги:
                <span class="service-section__span service-section__span_file-description description">${item.properties.tags}</span>
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
  setSearchString(value) {
    this._searchString = value;
  }

  getSearchResult() {
    return this._searchResult;
  }
  setSearchResult(value) {
    this._searchResult = value;
  }

}