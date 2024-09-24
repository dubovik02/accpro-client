import Properties from '../../../properties/Properties';
import likeIco from "../../../../images/like32.png";
import viewIco from "../../../../images/view64.png";
import openIco from "../../../../images/folder.png";
import newIco from "../../../../images/new-doc.png";
import saveIco from "../../../../images/save.png";
import saveCopyIco from "../../../../images/savecopy.png";
import printIco from "../../../../images/printer.png";
import settingIco from "../../../../images/setting.png";
import shareIco from "../../../../images/share.png";
import calcIco from "../../../../images/calc.png";
import planeIco from "../../../../images/paper-plane.png";
import refreshIco from "../../../../images/reload.png";

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
            <!--p class="service-section__description">
              ${Properties.lang.dict.notebook.notebook}:
              <span class="service-section__span file-name"></span>
                |
              <span class="service-section__span file-date"></span>
            </p--!>

            <!--p class="service-section__description">
              ${Properties.lang.dict.notebook.name}:
              <span class="service-section__span service-section__span_file-description description"></span>
              <span class="service-section__span service-section__span_file-description sharestatus"></span>
            </p--!>

            <!--div class="service-section__icon-container">
              <div class="service-section__icon-container">
                <img class="service-section__icon service-section__icon_linked like" src="${likeIco}">
                <span class="service-section__span likes-counter"></span>
              </div>
              <div class="service-section__icon-container">
                <img class="service-section__icon" src="${viewIco}">
                <span class="service-section__span views-counter"></span>
              </div>
            </div--!>
            `;
  }

  /**
   * Создает меню сервиса Песочница
   * @returns HTML меню
   */
  getSandBoxMenuHTML() {
    return `<ul class="service-section__menu-list">

              <li class="service-section__menu-item">
                <a class="link service-section__link menu-item-refresh"><img class="service-section__icon" title="${Properties.lang.dict.sandbox.menu.refresh}" src="${refreshIco}"></a>
              </li>

              <li class="service-section__menu-item">
                <a class="link service-section__link menu-item-new"><img class="service-section__icon" src="${newIco}">${Properties.lang.dict.sandbox.menu.new}</a>
              </li>

              <li class="service-section__menu-item">
                <a class="link service-section__link menu-item-open"><img class="service-section__icon" src="${openIco}">${Properties.lang.dict.sandbox.menu.open}</a>
              </li>
              <li class="service-section__menu-item">
                <a class="link service-section__link  menu-item-save"><img class="service-section__icon" src="${saveIco}">${Properties.lang.dict.sandbox.menu.save}</a>
              </li>
              <li class="service-section__menu-item">
                <a class="link service-section__link  menu-item-saveascopy"><img class="service-section__icon" src="${saveCopyIco}">${Properties.lang.dict.sandbox.menu.saveCopy}</a>
              </li>


              <li class="service-section__menu-item">
                <a class="link service-section__link  menu-item-print"><img class="service-section__icon" src="${printIco}">${Properties.lang.dict.sandbox.menu.print}</a>
              </li>

              <li class="service-section__menu-item">
                <a class="link service-section__link menu-item-properties">
                  <img class="service-section__icon" src="${settingIco}">${Properties.lang.dict.sandbox.menu.props}
                </a>
              </li>

              <li class="service-section__menu-item">
                <a class="link service-section__link menu-item-share">
                  <img class="service-section__icon" src="${shareIco}">${Properties.lang.dict.sandbox.menu.share}
                </a>
              </li>

              <li class="service-section__menu-item sharestatus">
                  <a class="link service-section__link menu-item-share">
                    <img class="service-section__icon" src="${planeIco}">
                    <!--span class="service-section__span service-section__span_file-description sharestatus"></span--!>
                  </a>
              </li>

              <li class="service-section__menu-item">
                <a class="link service-section__link menu-item-calc">
                  <img class="service-section__icon" src="${calcIco}">${Properties.lang.dict.sandbox.menu.calc} &#9660;
                </a>

                <ul class="service-section__submenu-list submenu-list-calc">
                  <li class="service-section__submenu-item">
                    <a class="link service-section__sublink submenu-item-calc-income">${Properties.lang.dict.sandbox.menu.calcIncome}</a>
                  </li>
                  <li class="service-section__submenu-item">
                    <a class="link service-section__sublink submenu-item-calc-outcome">${Properties.lang.dict.sandbox.menu.calcOutcome}</a>
                  </li>
                </ul>

              </li>

                <li class="service-section__menu-item">
                  <a class="link service-section__link menu-item-like">
                    <img class="service-section__icon service-section__icon_linked like" title="${Properties.lang.dict.sandbox.menu.like}" src="${likeIco}">
                    <span class="service-section__span likes-counter"></span>
                  </a>
                </li>

                <li class="service-section__menu-item">
                  <a class="link service-section__link menu-item-view">
                    <img class="service-section__icon" title="${Properties.lang.dict.sandbox.menu.view}" src="${viewIco}">
                    <span class="service-section__span views-counter"></span>
                  </a>
                </li>

            </ul>`;
  }

  /**
   * Создает набор вкладок сервиса Песочница для одной тетрадки
   * @returns HTML вкладок
   */
  getSandBoxTabsContainerHTML(notebookId) {
    return  `<div class="tabs-container tabs-container-notebook-items">

              <div class="tabs-container__tabs-content">
                <div class="tabs-container__item tabs-container__item_income" data-index="tab_1"></div>
                <div class="tabs-container__item tabs-container__item_active tabs-container__item_flows" data-index="tab_2"></div>
                <div class="tabs-container__item tabs-container__item_outcome" data-index="tab_3"></div>
              </div>

              <ul class="tabs-container__list">
                <li class="tabs-container__list-item">
                  <a class="tabs-container__button tabs-container__button_bottom tabs-container__button_income" id="tab_1">${Properties.lang.dict.sandbox.grids.incomeTitle}</a>
                </li>
                <li class="tabs-container__list-item">
                  <a class="tabs-container__button tabs-container__button_bottom tabs-container__button_active-bottom tabs-container__button_active tabs-container__button_flows" id="tab_2">${Properties.lang.dict.sandbox.grids.flowTitle}</a>
                </li>
                <li class="tabs-container__list-item">
                  <a class="tabs-container__button tabs-container__button_bottom tabs-container__button_outcome" id="tab_3">${Properties.lang.dict.sandbox.grids.outcomeTitle}</a>
                </li>
              </ul>

            </div>`;
  }

  /**
   * Создает набор вкладок для тетрадей
   * @returns
   */
  getNotebookTabsHTML() {
    return  `<div class="tabs-container tabs-container-notebooks">

              <ul class="tabs-container__list">
                <li class="tabs-container__list-item">
                  <a class="tabs-container__button tabs-container__button_top tabs-container__button_active-top tabs-container__button_active tabs-container__button_notebook" id="tab_4" title="">
                    <span class="service-section__span service-section__span_file-description description"></span>
                    (
                    <span class="service-section__span file-name"></span>
                    ,
                    <span class="service-section__span file-date"></span>
                    )
                  </a>
                </li>
              </ul>

              <div class="tabs-container__tabs-content">
                <div class="tabs-container__item tabs-container__item_active tabs-container__item_notebook" data-index="tab_4">

                </div>
              </div>

            </div>`;
  }

}