import Properties from '../../properties/Properties';

/**
 * Фабрика компонент
 */
 export default class ComponentsFactory {

  constructor() {

  }

  /**
   * Создает и возвращает прелоадер
   * @param {String} loaderText
   * @returns DOM-компонент прелоадера
   */
  createPreloader(loaderText) {

    const preloaderComponentDOM = document.createElement('div');
    preloaderComponentDOM.classList.add('preloader-container');
    preloaderComponentDOM.classList.add('preloader-container_absolute');

    const loaderHTML = `<i class="circle-preloader"></i>
                        <p class="preloader-container__title">${loaderText}</p>`;
    preloaderComponentDOM.insertAdjacentHTML('afterbegin', loaderHTML);

    return preloaderComponentDOM;

  }

  /**
   * Создает форму поскового запроса
   * @returns Компонент поискового запроса
   */
  createSearchForm() {

    const componentDOM = document.createElement('div');
    componentDOM.classList.add('search-section__container');

    const html = `<input class="input search-section__input-search" placeholder="${Properties.lang.dict.search.inputSearchObject}">
                  <button class="button search-section__button-search">${Properties.lang.dict.search.buttonFind}</button>
                  `;
    componentDOM.insertAdjacentHTML('afterbegin', html);
    return componentDOM;
  }

  /**
   * Создает HTML форму поискового запроса
   * @returns HTML формы
   */
  getSearchFormHTML() {
    return `<div class="search-section__container">
              <input class="input search-section__input-search" tabindex="0" autofocus placeholder="${Properties.lang.dict.search.inputSearchObject}">
              <button class="button search-section__button-search">${Properties.lang.dict.search.buttonFind}</button>
            </div>
            `;
            //size="82"
  }

  /**
   * Создает HTML форму расширенного поискового запроса
   * @returns HTML формы
   */
   getAdvancedSearchFormHTML() {
    return `
              ${this.getSearchFormHTML()}
              <div class="search-section__prop-container">
                <p class="search-section__title">${Properties.lang.dict.search.searchIn}:</p>
                <a class="link search-section__link search-section__link-document search-section__link_active">${Properties.lang.dict.search.searchDocument}</a>
                <a class="link search-section__link search-section__link-title" field="properties.shortdesc">${Properties.lang.dict.search.searchName}</a>
                <a class="link search-section__link search-section__link-description" field="properties.description">${Properties.lang.dict.search.searchDescription}</a>
                <a class="link search-section__link search-section__link-hashtag" field="properties.tags">${Properties.lang.dict.search.searchHashTags}</a>
              </div>
            `;
  }

 }