import ServiceBuilder from "../ServiceBuilder";
import {Grid} from 'ag-grid-community';
import Properties from "../../../properties/Properties";
import { Number } from "core-js";

/**
 * Сервис Песочницы
 */
export default class SandBoxBuilder extends ServiceBuilder {

  /**
   * Таблица входящих остатков
   */
  _openingGridObject;

  /**
   * Элемент таблицы входящих остатков
   */
  _openingGridElement;

  /**
   * Таблица исходящих остатков
   */
  _closeingGridObject;

  /**
   * Элемент таблицы исходящих остатков
   */
  _closeingGridElement;

  /**
   * Таблица оборотов
   */
  _flowGridObject;

  /**
   * Элемент таблицы оборотов
   */
  _flowGridElement;

  /**
   * Текущий документ
   */
  _currentDocument;

  /**---------Пункт меню "Рассчитать"----------- */

  /**
   * Подпункт "Входящие остатки"
   */
  _menuCalcIncome;

  /**
   * Подпункт "Обороты"
   */
   _menuCalcFlows;

   /**
   * Подпункт "Исходящие остатки"
   */
    _menuCalcOutcome;

   /**-------------------------------------------- */
  /**
   * Пункт меню "Сохранить"
   */
  _menuSave;

  /**
   * Пункт меню "Поделиться"
   */
  _menuShare;

  /**
   * Пункт меню "Загрузить"
   */
  _menuLoad;

  /**
   * Функция пересчета ячеек документа
   */
  _calcFunction;

  /**
   * Функция сохранения документа
   */
  _saveFunction;

  /**
   * Функция публикации документа
   */
  _shareFunction;

  /**
   * Функция загрузки документа
   */
  _loadFunction;


  constructor(props) {
    props.serviceName = 'Бухгалтерская песочница';
    props.serviceDescription = 'Сервис совместной работы над бухгалтерским кодом - проводками';
    super(props)
    this._calcFunction = this._props.calcFunction;
    this._saveFunction = this._props.saveFunction;
    this._shareFunction = this._props.shareFunction;
    this._loadFunction = this._props.loadFunction;

  }

  createDOM() {
    super.createDOM();
    this._createServiceMenu();
    this._createOpeningGrid();
    this._createFlowsGrid();
    this._createClosingGrid();
  }

  /**
   * Создает меню сервиса
   */
  _createServiceMenu() {

    const menuHtml = `<ul class="service-section__menu-list">
                        <li class="service-section__menu-item">
                          <a class="link service-section__link" href="#">Открыть</a>
                        </li>
                        <li class="service-section__menu-item">
                          <a class="link service-section__link" href="#">Сохранить</a>
                        </li>
                        <li class="service-section__menu-item">
                          <a class="link service-section__link" href="#">Поделиться</a>
                        </li>
                        <li class="service-section__menu-item">
                          <a class="link service-section__link menu-item-calc" href="#">
                            Рассчитать
                          </a>

                          <ul class="service-section__submenu-list">
                            <li class="service-section__submenu-item">
                              <a class="link service-section__sublink submenu-item-calc-income" href="#">Входящие остатки</a>
                            </li>
                            <li class="service-section__submenu-item">
                              <a class="link service-section__sublink submenu-item-calc-outcome" href="#">Исходящие остатки</a>
                            </li>
                          </ul>

                        </li>
                      </ul>`;

    this._serviceMenu.insertAdjacentHTML(`afterbegin`, menuHtml);
    this._setUpMenuItems();

  }

  /**
   * Создает таблицу входящих остатков
   */
  _createOpeningGrid() {

    this._openingGridElement = this._createGridElement('Входящие остатки (opening balance)','opening-grid');
    const gridOptions = this._getStockGridOptions();
    this._openingGridObject = this._createGridObject(this._openingGridElement, gridOptions);

  }

  /**
   * Создает таблицу оборотов
   */
  _createFlowsGrid() {

    this._flowGridElement = this._createGridElement('Обороты (flows)', 'flow-grid');
    const gridOptions = this._getFlowGridOptions();
    this._flowGridObject = this._createGridObject(this._flowGridElement, gridOptions);

  }

  /**
   * Создает таблицу исходящих остатков
   */
  _createClosingGrid() {

    this._closeingGridElement = this._createGridElement('Исходящие остатки (closeing balance)','closeing-grid');
    const gridOptions = this._getStockGridOptions();
    this._closeingGridObject = this._createGridObject(this._closeingGridElement, gridOptions);

  }

  /**
   * Создает элемент Grid с заданным заголовком и классом
   * @param {string} title заголовок Grid
   * @param {string} className имя класса элемента
   * @return {Element} элемент Grid
   */
  _createGridElement(title, className) {
    const gridHtml = `<p class="grid__title">${title}</p>
                      <div style="height: 270px; max-width: 100%;" class="${className} ag-theme-alpine"></div>`;
    //this._serviceView.insertAdjacentHTML('afterbegin', gridHtml);
    this._serviceView.insertAdjacentHTML('beforeend', gridHtml);
    return this._serviceView.querySelector(`.${className}`);
  }


  /**
   * Создает объект Grid на базе соответсвующего элемента и объекта свойств
   * @param {Element} gridElement элемент
   * @param {Object} gridOptions объект свойств
   * @return {Grid} объект Grid
   */
  _createGridObject(gridElement, gridOptions) {
    const grid = new Grid(gridElement, gridOptions);
    grid.gridOptions.api.sizeColumnsToFit();
    return grid;
  }


  /**
   * Генерирует объект опций для Grid-ов остатков
   * @return {Object} объект свойств
   */
  _getStockGridOptions() {

    const columnDefs = [

      {
        headerName: '#',
        colId: 'rowNum',
        valueGetter: 'node.id',
        width: 30,
        pinned: 'left'
      },

      { headerName: 'Счет', field: 'accountNumber', resizable: true, editable: true, /*sortable: true, filter: 'agTextColumnFilter'*/},
      { headerName: 'Остаток по дебету', field: 'debet', resizable: true, editable: true, valueFormatter: this.currencyFormatter,/*sortable: true, filter: 'agNumberColumnFilter', type: 'numericColumn'*/ },
      { headerName: 'Остаток по кредиту', field: 'credit', resizable: true, editable: true, valueFormatter: this.currencyFormatter,/*sortable: true, filter: 'agNumberColumnFilter', type: 'numericColumn'*/ },

      { headerName: 'Пояснение', field: 'note', resizable: true, editable: true },

    ];

    // specify the default row data count
    const rowData = [
    ];

    for (let i = 0; i < Properties.sandBox.grid.rowCount - 1; i++) {
      rowData.push({});
    }

    // let the grid know which columns and what data to use
    const gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData
    };

    return gridOptions;
  }

  /**
   * Генерирует объект опций для Grid-а потоков
   * @return {Object} объект свойств
   */
  _getFlowGridOptions() {

    const columnDefs = [

      {
        headerName: '#',
        colId: 'rowNum',
        valueGetter: 'node.id',
        width: 30,
        pinned: 'left'
      },

      { headerName: 'Содержание операции', field: 'operationDesc', resizable: true, editable: true, /*sortable: true, filter: 'agTextColumnFilter'*/ },
      { headerName: 'Счет по дебету', field: 'debet', resizable: true, editable: true, /*sortable: true, filter: 'agTextColumnFilter' */},
      { headerName: 'Счет по кредиту', field: 'credit', resizable: true, editable: true, /*sortable: true, filter: 'agTextColumnFilter'*/ },

      { headerName: 'Сумма', field: 'summ', resizable: true, editable: true, valueFormatter: this.currencyFormatter,/*sortable: true, filter: 'agNumberColumnFilter', type: 'numericColumn' */},

      { headerName: 'Пояснение', field: 'note', resizable: true, editable: true, /*sortable: true*/ },

    ];

    // specify the default row data count
    const rowData = [
    ];

    for (let i = 0; i < Properties.sandBox.grid.rowCount - 1; i++) {
      rowData.push({});
    }

    // let the grid know which columns and what data to use
    const gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData
    };

    return gridOptions;
  }


  /**
   * Инициация пунктов меню и обработчиков событий меню
   */
  _setUpMenuItems() {

    this._setUpMenuItemCalc();
  }

  /**
   * Настройка меню Рассчитать
   */
  _setUpMenuItemCalc() {


    this._menuCalcIncome = this._serviceMenu.querySelector('.submenu-item-calc-income');
    this._menuCalcOutcome = this._serviceMenu.querySelector('.submenu-item-calc-outcome');

    this._menuCalcIncome.addEventListener('click', () => {
      const income = this.getStockGridData(this._openingGridObject);
      const outcome = this.getStockGridData(this._closeingGridObject);
      const flows = this.getFlowGridData(this._flowGridObject);
      let result = this._calcFunction.call(this, income, flows, outcome, 0);
      this.setStockGridData(this._openingGridObject, result, true);

    })

    this._menuCalcOutcome.addEventListener('click', () => {
      const income = this.getStockGridData(this._openingGridObject);
      const outcome = this.getStockGridData(this._closeingGridObject);
      const flows = this.getFlowGridData(this._flowGridObject);
      let result = this._calcFunction.call(this, income, flows, outcome, 2);
      this.setStockGridData(this._closeingGridObject, result, false);
    })

  }

  /**
   * Возвращает данные из таблицы остатков
   * @param {Object} stockGrid - объект таблицы остатков
   */
  getStockGridData(stockGrid) {
    let totalObj = [];
    stockGrid.gridOptions.api.forEachNode((rowNode, index) => {
      let currentObj = {
        accountNumber: rowNode.data.accountNumber,
        debet: rowNode.data.debet,
        credit: rowNode.data.credit,
        note: rowNode.data.note,
      };
      totalObj.push(currentObj);
    })
    return totalObj;
  }

  /**
   * Возвращает данные таблицы оборотов
   * @param {Object} flowGrid - таблица оборотов
   */
  getFlowGridData(flowGrid) {
    let totalObj = [];
    flowGrid.gridOptions.api.forEachNode((rowNode, index) => {
      let currentObj = {
        operationDesc: rowNode.data.operationDesc,
        debet: rowNode.data.debet,
        credit: rowNode.data.credit,
        summ: rowNode.data.summ,
        note: rowNode.data.note,
      };
      totalObj.push(currentObj);
    })
    return totalObj;
  }

  /**
   *
   * @param {Grid} gridObj - таблица остатков
   * @param {Object} stockData - данные по остаткам
   * @param {Boolean} isIncome - True - данные о входящих остатках, False - данные об исходящих
   */
  setStockGridData(gridObj, stockData, isIncome) {

    //очищаем данные
    this._clearGridData(gridObj)

    //заполняем новые данные
    const rowData = [];
    const dataArr = stockData.accounts;

    for (let i = 0; i < dataArr.length; i++) {

      let accObj =
      {
        accountNumber: dataArr[i].accNumber,
        debet: isIncome ? dataArr[i].openBalance.debet : dataArr[i].closeBalance.debet,
        credit: isIncome ? dataArr[i].openBalance.credit : dataArr[i].closeBalance.credit,
        note: dataArr[i].description,
      }
      rowData.push(accObj);
    }

    gridObj.gridOptions.api.setRowData(rowData);

  }

  /**
   * Очищает данные грида
   * @param {Grid} gridObj - объект грида
   */
  _clearGridData(gridObj) {
    const rowData = [];
    gridObj.gridOptions.api.setRowData(rowData);
  }



  /**
   * Форматирует значение ячейки в число
   * @param {Object} params
   */
  currencyFormatter(params) {

    let valueNumb = Number.parseFloat(params.value);
    if (!valueNumb) {
      return '';
    }

    valueNumb = valueNumb.toFixed(2);
    return valueNumb;
  }

}