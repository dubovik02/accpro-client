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

 }