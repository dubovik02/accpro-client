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

    const html = `<input class="input search-section__input-search" placeholder="Объекты учета, содержание операции или проводок..."></>
                  <button class="button search-section__button-search">Найти</button>
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
              <input class="input search-section__input-search" tabindex="0" autofocus size="82" placeholder="Объекты учета, содержание операции или проводок..."></>
              <button class="button search-section__button-search">Найти</button>
            </div>
            `
  }

  /**
   * Создает HTML форму расширенного поискового запроса
   * @returns HTML формы
   */
   getAdvancedSearchFormHTML() {
    return `
            <div>
              ${this.getSearchFormHTML()}
              <div class="search-section__prop-container">
                <p class="search-section__title">Искать в:</p>
                <a class="link search-section__link search-section__link-document search-section__link_active">документе</a>
                <a class="link search-section__link search-section__link-title" field="properties.shortdesc">названии</a>
                <a class="link search-section__link search-section__link-description" field="properties.description">описании</a>
                <a class="link search-section__link search-section__link-hashtag" field="properties.tags">хэш-тегах</a>
              </div>
            </div>`
  }

 }