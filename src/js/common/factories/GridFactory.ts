import {createGrid, GridApi} from 'ag-grid-community';

/**
 * Фабрика таблиц
 */
 export default class GridFactory {

  constructor() {
  }

  /**
   * Создает элемент Grid с заданными параметрами
   * @param {Object} optionsObj объект опций грида (CSS-свойства и т.п.)
   * @return {HTMLDivElement} элемент Grid
   */
   createGridElement(optionsObj : {className : string; height: string; maxWidth : string}) : HTMLDivElement {

    const gridElement = document.createElement('div');
    gridElement.classList.add(`${optionsObj.className}`);
    gridElement.classList.add(`ag-theme-alpine`);
    gridElement.style.height = optionsObj.height;
    gridElement.style.maxWidth = optionsObj.maxWidth;
    return gridElement;
  }

  /**
   * Создает объект Grid на базе соответсвующего элемента и объекта свойств
   * @param {Element} gridElement элемент
   * @param {Object} gridOptions объект свойств
   * @return {Grid} объект Grid
   */
  createGridObject(gridElement : HTMLDivElement, gridOptions : { [key: string]: any }) : GridApi {
    const grid = createGrid(gridElement, gridOptions);
    return grid;
  }

}