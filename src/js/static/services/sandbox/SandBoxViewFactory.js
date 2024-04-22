import Properties from '../../../properties/Properties';
import likeIco from "../../../../images/like32.png";
import viewIco from "../../../../images/view64.png";

/**
 * Фабрика компонент представления сервиса Песочницы
 */
 export default class SandBoxViewFactory {

  constructor() {
  }

  /**
   * Создает статусную панель (имя файла, автор, создан, сохранен и т.п.) сервиса Песочница
   * @returns HTML меню
   */
  getSandBoxStatusBarHTML() {
    return `
            <p class="service-section__description">
              ${Properties.lang.dict.notebook.notebook}:
              <span class="service-section__span file-name"></span>
                |
              <span class="service-section__span file-date"></span>
            </p>

            <p class="service-section__description">
              ${Properties.lang.dict.notebook.name}:
              <span class="service-section__span service-section__span_file-description description"></span>
              <span class="service-section__span service-section__span_file-description sharestatus"></span>
            </p>

            <div class="service-section__icon-container">
              <div class="service-section__icon-container">
                <img class="service-section__icon service-section__icon_linked like" src="${likeIco}">
                <span class="service-section__span likes-counter"></span>
              </div>
              <div class="service-section__icon-container">
                <img class="service-section__icon" src="${viewIco}">
                <span class="service-section__span views-counter"></span>
              </div>
            </div>
            `;
  }

  /**
   * Создает меню сервиса Песочница
   * @returns HTML меню
   */
  getSandBoxMenuHTML() {
    return `<ul class="service-section__menu-list">

            <li class="service-section__menu-item">
              <a class="link service-section__link menu-item-new">${Properties.lang.dict.sandbox.menu.new}</a>
            </li>

            <li class="service-section__menu-item">
              <a class="link service-section__link menu-item-open">${Properties.lang.dict.sandbox.menu.open}</a>
            </li>
            <li class="service-section__menu-item">
              <a class="link service-section__link  menu-item-save">${Properties.lang.dict.sandbox.menu.save}</a>
            </li>
            <li class="service-section__menu-item">
              <a class="link service-section__link  menu-item-saveascopy">${Properties.lang.dict.sandbox.menu.saveCopy}</a>
            </li>


            <li class="service-section__menu-item">
              <a class="link service-section__link  menu-item-print">${Properties.lang.dict.sandbox.menu.print}</a>
            </li>

            <li class="service-section__menu-item">
              <a class="link service-section__link menu-item-properties">${Properties.lang.dict.sandbox.menu.props}</a>
            </li>
            <li class="service-section__menu-item">
              <a class="link service-section__link menu-item-share">${Properties.lang.dict.sandbox.menu.share}</a>
            </li>

            <li class="service-section__menu-item">
              <a class="link service-section__link menu-item-calc">
                ${Properties.lang.dict.sandbox.menu.calc}
              </a>

              <ul class="service-section__submenu-list">
                <li class="service-section__submenu-item">
                  <a class="link service-section__sublink submenu-item-calc-income">${Properties.lang.dict.sandbox.menu.calcIncome}</a>
                </li>
                <li class="service-section__submenu-item">
                  <a class="link service-section__sublink submenu-item-calc-outcome">${Properties.lang.dict.sandbox.menu.calcOutcome}</a>
                </li>
              </ul>

            </li>
          </ul>`;
  }

  /**
   * Создает набор вкладок сервиса Песочница
   * @returns HTML вкладок
   */
  getSandBoxTabsContainerHTML() {
    return  `<div class="tabs-container">

              <ul class="tabs-container__list">
                <li class="tabs-container__list-item">
                  <a class="tabs-container__button tabs-container__button_income" id="tab_1">${Properties.lang.dict.sandbox.grids.incomeTitle}</a>
                </li>
                <li class="tabs-container__list-item">
                  <a class="tabs-container__button tabs-container__button_flows tabs-container__button_active" id="tab_2">${Properties.lang.dict.sandbox.grids.flowTitle}</a>
                </li>
                <li class="tabs-container__list-item">
                  <a class="tabs-container__button tabs-container__button_outcome" id="tab_3">${Properties.lang.dict.sandbox.grids.outcomeTitle}</a>
                </li>
              </ul>

              <div class="tabs-container__tabs-content">
                <div class="tabs-container__item tabs-container__item_income" data-index="tab_1"></div>
                <div class="tabs-container__item tabs-container__item_active tabs-container__item_flows" data-index="tab_2"></div>
                <div class="tabs-container__item tabs-container__item_outcome" data-index="tab_3"></div>
              </div>

            </div>`;
  }

}