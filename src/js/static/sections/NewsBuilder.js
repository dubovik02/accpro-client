import SectionBuilder from "./SectionBuilder";
import { getNewsPeriod } from '../../lib/date';

export default class NewsBuilder extends SectionBuilder {

  /**
   * Набор элементов-фильтров
   */
  _tagsList;

  /**
   * Контейнер для элементов-фильтров
   */
  _tagsContainer;

  /**
   * Колбэк фильтра
   */
  _filterFunction;

  /**
   * Элемент фильтра "С"
   */
  _dateFrom;

  /**
   * Элемент фильтра "По"
   */
  _dateTo;

  constructor(props) {
    props.sectionTitle = 'Новости';
    props.sectionSubtitle = `Что нового и примечательного?`;
    props.sectionClassName = 'news';
    super(props);
    this._filterFunction = this._props.filterFunction;
  }

  createDOM() {
    super.createDOM();
    this._createAdditionalDOM();
  }

  /**
   * Формирует дополнительную секцию-фильтр
   */
  _createAdditionalDOM() {

    if (this._cardsList.getCardsListLength() !== 0) {
      this._preBlock.insertAdjacentHTML('afterbegin', this._createFilterSectionDOM());
      this._tagsContainer = this._componentDOM.querySelector('.filter__container-tags');
      this._buildTagsContainer();

     this._dateFrom = this._componentDOM.querySelector('.input-date-from');
     this._dateTo = this._componentDOM.querySelector('.input-date-to');

     const period = getNewsPeriod(true);
     this._dateFrom.value = period.fromDateStr;
     this._dateTo.value = period.nowDateStr;

     this._setDataFilterListener(this._dateTo);
     this._setDataFilterListener(this._dateFrom);

   }

  }

  /**
   * Создает подсекцию с фильтрами
   */
  _createFilterSectionDOM() {

    return `<div class="filter">
              <div class="filter__container filter__container-dates">
                  <p class="filter__title">За период:</p>
                  <input class="input input-date input-date-from" type="date"></input>
                  <p class="filter__title"> - </p>
                  <input class="input input-date input-date-to" type="date"></input>
              </div>
              <p class="filter__title">и по основным темам:</p>
              <div class="filter__container filter__container-tags">

              </div>
            </div>`;
  }

  /**
   * Применяет текущие параметры фильтра по тегам
   */
  _applyTagsFilter() {

    const fromDateStr = this._dateFrom.value;
    const toDateStr = this._dateTo.value;

    //если даты заданы не корректно
    if (!fromDateStr || !toDateStr) {
      return;
    }

    const keyWords = this._createTopicFilter();

    if (this.getFilterFunction() instanceof Function) {
      this.getFilterFunction().call(this, keyWords, fromDateStr, toDateStr);
    }

  }

    /**
   * Применяет текущие параметры фильтра по дате
   */
  _applyDataFilter() {

    const fromDateStr = this._dateFrom.value;
    const toDateStr = this._dateTo.value;

    //если даты заданы не корректно
    if (!fromDateStr || !toDateStr) {
      return;
    }

    if (this.getFilterFunction() instanceof Function) {
      this.getFilterFunction().call(this, [], fromDateStr, toDateStr)
      .then((res) => {
        //переиндексируем тэги
        this._buildTagsContainer();
      })
      .catch((err) => {

      });
    }
  }

  /**
   * Формирует условия отбора для фильтра по тэгам
   */
  _createTopicFilter() {

    const keyWords = [];
    this._tagsList.forEach(item => {
      if (!item.classList.contains('filter__tag-link_unactive')) {
        keyWords.push(item.textContent.split(' ')[0]);
      }
    })

    // еслм условия отбора не установлены - отбираем все
    if (!keyWords.length) {
      this._tagsList.forEach(item => {
        keyWords.push(item.textContent.split(' ')[0]);
      })
    }

    return keyWords;
  }

  /**
   * Устанавливает обработчик для элемента фильтра
   * @param {Element} elem элемент
   */
  _setFilterListener(elem) {
    elem.addEventListener('click', () => {
      elem.classList.toggle('filter__tag-link_unactive');
      this._applyTagsFilter();
    })
  }

  /**
   * Устанавливает обработчик для элемента фильтра по дате
   * @param {Element} elem элемент
   */
  _setDataFilterListener(elem) {
    elem.addEventListener('change', () => {
      this._applyDataFilter();
    })
  }

  getFilterFunction() {
    return this._filterFunction;
  }

  /**
   * строит содержимое фильтра по тэгам на основании данных списка карточек
   */
  _buildTagsContainer() {

    this._clearTagsContainer();

    const newsMap = new Map();
    const itemList = this.getCardsList().getCardsArray();
    itemList.forEach((item) => {
      if (newsMap.has(item.getProps().keyWord)) {
        newsMap.set(item.getProps().keyWord, newsMap.get(item.getProps().keyWord) + 1);
      }
      else {
        newsMap.set(item.getProps().keyWord, 1);
      }
    });

    let keyWordHtml = '';

    for (let item of newsMap) {
      keyWordHtml = keyWordHtml + `<p class="link filter__tag-link filter__tag-link_unactive">${item[0] + ' (' + item[1] + ')'}</p>`;
    }

    this._tagsContainer.insertAdjacentHTML('afterbegin', keyWordHtml);

    this._tagsList = this._componentDOM.querySelectorAll('.filter__tag-link');
      this._tagsList.forEach(item => {
        this._setFilterListener(item);
    });

  }

  /**
   * Очищает фильтра по тэгам
   */
  _clearTagsContainer() {
    while (this._tagsContainer.firstChild) {
      this._tagsContainer.removeChild(this._tagsContainer.firstChild);
    }
  }

}