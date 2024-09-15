import Properties from "../../../properties/Properties";
import {Grid} from 'ag-grid-community';

import addRowUpIco from "../../../../images/grid/above.png";
import addRowDownIco from "../../../../images/grid/below.png";
import removeRowIco from "../../../../images/grid/delete.png";

/**
 * Класс гридов сервиса Песочницы
 */
export default class SandBoxGrid {

  _contextMenu;

  SandBoxGrid() {
  }

  /**
   * Создает элемент Grid с заданным заголовком и классом
   * @param {string} className имя класса элемента
   * @return {Element} элемент Grid
   */
  createGridElement(className) {
    const el = document.createElement('div');
    el.classList.add(`${className}`);
    el.classList.add(`ag-theme-alpine`);
    el.style.height = '60vh';
    el.style.width = '100%';
    return el;
  }

  /**
   * Создает объект Grid на базе соответсвующего элемента и объекта свойств
   * @param {Element} gridElement элемент
   * @param {Object} gridOptions объект свойств
   * @return {Grid} объект Grid
   */
  createGridObject(gridElement, gridOptions) {
    const grid = new Grid(gridElement, gridOptions);
    grid.gridOptions.api.sizeColumnsToFit();

    gridElement.onmousedown = (event) => {this._showContextMenu(gridElement, grid, event)};
    gridElement.addEventListener('mouseleave', (event) => {
      this._removeContextMenu();
      event.preventDefault();
    });


    return grid;
  }

  /**
   * Создает объект Grid операций на базе соответсвующего элемента и объекта свойств
   * @param {Element} gridElement элемент
   * @param {Object} gridOptions объект свойств
   * @return {Grid} объект Grid
   */
  createFlowGridObject(className) {
    const elem = this.createGridElement(className);
    const options = this.getFlowGridOptions();
    const obj = this.createGridObject(elem, options);
    return obj;
  }

  /**
   * Создает объект Grid остатков на базе соответсвующего элемента и объекта свойств
   * @param {Element} gridElement элемент
   * @param {Object} gridOptions объект свойств
   * @return {Grid} объект Grid
   */
  createStockGridObject(className) {
    return this.createGridObject(this.createGridElement(className), this.getStockGridOptions());
  }

  /**
   * Возвращает объект настроек грида по описанию
   * @param {Object} columnDefs
   * @returns gridOptions
   */
   getGridOptions(columnDefs) {

    // specify the default row data count
    const rowData = [
    ];

    for (let i = 0; i < Properties.sandBox.grid.rowCount - 1; i++) {
      rowData.push({});
    }

    // let the grid know which columns and what data to use
    const gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData,
      rowDragManaged: true,
      animateRows: true,
      undoRedoCellEditing: true,
      undoRedoCellEditingLimit: 20,
      rowSelection: 'single',
    };

    return gridOptions;
  }

/**
   * Генерирует объект опций для Grid-ов остатков
   * @return {Object} объект свойств
   */
 getStockGridOptions() {

  const columnDefs = [

    {
      headerName: '#',
      colId: 'rowNum',
      valueGetter: 'node.id',
      width: 30,
      pinned: 'left',
    },

    { headerName: `${Properties.lang.dict.sandbox.grids.account}`, field: 'accountNumber', resizable: true, editable: true, rowDrag: true, minWidth: Properties.sandBox.grid.accColWidth,},
    { headerName: `${Properties.lang.dict.sandbox.grids.debitStock}`, field: 'debet', resizable: true, editable: true, valueFormatter: this.currencyFormatter, minWidth: Properties.sandBox.grid.numberColWidth, },
    { headerName: `${Properties.lang.dict.sandbox.grids.creditStock}`, field: 'credit', resizable: true, editable: true, valueFormatter: this.currencyFormatter, minWidth: Properties.sandBox.grid.numberColWidth, },
    { headerName: `${Properties.lang.dict.sandbox.grids.note}`, field: 'note', resizable: true, editable: true, tooltipValueGetter: this.toolTipValueGetter, minWidth: Properties.sandBox.grid.minTextColWidth,/*wrapText: true, autoHeight: true,*/},

  ];

  return this.getGridOptions(columnDefs);
}

  /**
   * Генерирует объект опций для Grid-а потоков
   * @return {Object} объект свойств
   */
  getFlowGridOptions() {

    const columnDefs = [

      {
        headerName: '#',
        colId: 'rowNum',
        valueGetter: 'node.id',
        width: 30,
        pinned: 'left'
      },

      { headerName: `${Properties.lang.dict.sandbox.grids.flowNote}`, field: 'operationDesc', resizable: true, editable: true, rowDrag: true, tooltipValueGetter: this.toolTipValueGetter, minWidth: Properties.sandBox.grid.minTextColWidth, /*wrapText: true, autoHeight: true,*/},
      { headerName: `${Properties.lang.dict.sandbox.grids.accDebit}`, field: 'debet', resizable: true, editable: true, minWidth: Properties.sandBox.grid.accColWidth,},
      { headerName: `${Properties.lang.dict.sandbox.grids.accCredit}`, field: 'credit', resizable: true, editable: true, minWidth: Properties.sandBox.grid.accColWidth,},
      { headerName: `${Properties.lang.dict.sandbox.grids.summ}`, field: 'summ', resizable: true, editable: true, valueFormatter: this.currencyFormatter, minWidth: Properties.sandBox.grid.numberColWidth,},
      { headerName: `${Properties.lang.dict.sandbox.grids.note}`, field: 'note', resizable: true, editable: true, tooltipValueGetter: this.toolTipValueGetter, minWidth: Properties.sandBox.grid.minTextColWidth, /*wrapText: true, autoHeight: true,*/},

    ];

    return this.getGridOptions(columnDefs);
  }

/**
 * Возвращает данные из таблицы остатков
 * @param {Object} stockGrid - объект таблицы остатков
 */
  getStockGridData(stockGrid) {
    let totalObj = [];
    stockGrid.gridOptions.api.forEachNode((rowNode, index) => {

      // проверяем наличие счета при наличии оборотов
      let accNumber = rowNode.data.accountNumber ? rowNode.data.accountNumber.trim() : rowNode.data.accountNumber;
      if ((rowNode.data.debet || rowNode.data.credit) && (!accNumber)) {
        accNumber = Properties.sandBox.grid.emptyAccountNumber;
      }

      let currentObj = {
        // accountNumber: rowNode.data.accountNumber ? rowNode.data.accountNumber.trim() : rowNode.data.accountNumber,
        accountNumber: accNumber,
        debet: rowNode.data.debet,
        credit: rowNode.data.credit,
        note: rowNode.data.note,
      };
      if (this.isNotEmptyObj(currentObj)) {
        totalObj.push(currentObj);
      }
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

      //проверяем все ли параметры проводки есть
      let accDebit = rowNode.data.debet ? rowNode.data.debet.trim() : rowNode.data.debet;
      let accCredit = rowNode.data.credit ? rowNode.data.credit.trim() : rowNode.data.credit;
      if (accDebit && (!accCredit)) {
        accCredit = Properties.sandBox.grid.emptyAccountNumber;
      }
      if (accCredit && (!accDebit)) {
        accDebit = Properties.sandBox.grid.emptyAccountNumber;
      }

      let currentObj = {
        operationDesc: rowNode.data.operationDesc,
        // debet: rowNode.data.debet ? rowNode.data.debet.trim() : rowNode.data.debet,
        // credit: rowNode.data.credit ? rowNode.data.credit.trim() : rowNode.data.credit,
        debet: accDebit,
        credit: accCredit,
        summ: rowNode.data.summ,
        note: rowNode.data.note,
      };
      if (this.isNotEmptyObj(currentObj)) {
        totalObj.push(currentObj);
      }
    })
    return totalObj;
  }

  /**
   * Устанавливает данные таблицы остатков
   * @param {Grid} gridObj - таблица остатков
   * @param {Object} stockData - данные по остаткам
   * @param {Boolean} isIncome - True - данные о входящих остатках, False - данные об исходящих
   */
  setStockGridData(gridObj, stockData, isIncome) {

    //очищаем данные
    this.clearGridData(gridObj)

    //заполняем новые данные
    const rowData = [];
    const dataArr = stockData.accounts;

    //если данные есть
    if (dataArr && dataArr.length) {
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
    }

    //дозаполняем грид до целевого значения
    for (let i = 0; i < Properties.sandBox.grid.rowCount - 1 - (dataArr ? dataArr.length : 0); i++) {
      rowData.push({});
    }

    gridObj.gridOptions.api.setRowData(rowData);

  }

  /**
   * Заполняет данными таблицу оборотов
   * @param {Grid} gridObj таблица оборотов
   * @param {Object} flowData данные по оборотам
   */
  setFlowGridData(gridObj, flowData) {

    this.clearGridData(gridObj);

    //заполняем новые данные
    const rowData = [];
    const dataArr = flowData.entries;

    //если данные есть
    if (dataArr && dataArr.length) {
      for (let i = 0; i < dataArr.length; i++) {

        let entryObj =
        {
          operationDesc: dataArr[i].name,
          debet: dataArr[i].accDebet.accNumber,
          credit: dataArr[i].accCredit.accNumber,
          summ: dataArr[i].summ ? dataArr[i].summ : 0,
          note: dataArr[i].description,
        }
        rowData.push(entryObj);
      }
    }

    //дозаполняем грид до целевого значения
    for (let i = 0; i < Properties.sandBox.grid.rowCount - 1 - (dataArr ? dataArr.length : 0); i++) {
      rowData.push({});
    }

    gridObj.gridOptions.api.setRowData(rowData);

  }

  /**
   * Очищает данные грида
   * @param {Grid} gridObj - объект грида
   */
   clearGridData(gridObj) {
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
      valueNumb = new Intl.NumberFormat(/*"ru"*/navigator.language, {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(valueNumb);
      return valueNumb;
    }

    /**
     * Всплывающая подсказка (колл-бэк)
     */
    toolTipValueGetter = (params) =>
      params.value == null || params.value === "" ? "-" : params.value;

    // проверяет, являются ли все объекты массива пустыми
    isNotEmptyObj(obj) {

      for (var key of Object.keys(obj)) {
        if (obj[key]) {
          return true;
        }
      }
      return false;
    }

    /**
     * Возвращает данные гридов
     * @param {Grid} incomeGridObject
     * @param {Grid} flowsGridObject
     * @param {Grid} outcomeGridObject
     * @returns {Object} данные гридов
     */
    getData(incomeGridObject, flowsGridObject, outcomeGridObject) {

      const income = this.getStockGridData(incomeGridObject);
      const outcome = this.getStockGridData(outcomeGridObject);
      const flows = this.getFlowGridData(flowsGridObject);

      return {
        income: income,
        outcome: outcome,
        flows: flows,
      }
    }

    _showContextMenu (elem, gridObj, event) {
      this._createContextMenuHTML(elem, gridObj, event);
    }

    _createContextMenuHTML (elem, gridObj, event) {

      if (!this._contextMenu) {

        if (event.which === 3) {
          this._contextMenu = document.createElement('div');
          this._contextMenu.classList.add('context-menu');

          let itemsHtml = `
                          <li class="context-menu-item">
                            <a class="context-menu__link menu-addRowUp">
                              <img class="context-menu__icon" src=${addRowUpIco}>
                              ${Properties.lang.dict.sandbox.grids.contextMenu.addRowUp}
                            </a>
                          </li>

                          <li class="context-menu-item">
                            <a class="context-menu__link menu-addRowDown">
                              <img class="context-menu__icon" src=${addRowDownIco}>
                              ${Properties.lang.dict.sandbox.grids.contextMenu.addRowDown}
                            </a>
                          </li>

                          <li class="context-menu-item">
                            <a class="context-menu__link menu-removeRow">
                              <img class="context-menu__icon" src=${removeRowIco}>
                              ${Properties.lang.dict.sandbox.grids.contextMenu.removeRow}
                            </a>
                          </li>
                          `;
          this._contextMenu.insertAdjacentHTML('beforeend', itemsHtml);

          elem.insertAdjacentElement('beforeend', this._contextMenu);

          let menuAddUp = this._contextMenu.querySelector('.menu-addRowUp');
          menuAddUp.addEventListener('click', (e) => {
            e.stopPropagation();
            this._addRow(gridObj, true);
            this._removeContextMenu();
          });

          let menuAddDown = this._contextMenu.querySelector('.menu-addRowDown');
          menuAddDown.addEventListener('click', (e) => {
            e.stopPropagation();
            this._addRow(gridObj, false);
            this._removeContextMenu();
          });

          let menuDelete = this._contextMenu.querySelector('.menu-removeRow');
          menuDelete.addEventListener('click', (e) => {
            e.stopPropagation();
            this._deleteRow(gridObj);
            this._removeContextMenu();
          });

          let target = elem.getBoundingClientRect();
          this._contextMenu.style.left = event.clientX - target.left  + 'px';
          this._contextMenu.style.top = event.clientY - target.top + 'px';
          this._contextMenu.classList.add('context-menu_is-visible');
        }
      }
      // смотрим где был клик - вне меню - удаляем меню
      let menuClicked = (event.target.classList.contains('context-menu__link') || event.target.classList.contains('context-menu__icon'));
      if ( (event.which != 3) && (this._contextMenu) && (!menuClicked) ) {
        this._removeContextMenu();
      }
    }

    _removeContextMenu() {
      if (document.querySelector('.context-menu')) {
        document.querySelector('.context-menu').remove();
        this._contextMenu = null;
      }
    }

    _addRow(gridObj, isUp) {
      const rowNode = gridObj.gridOptions.api.getSelectedNodes()[0];
      const rowId = Number(rowNode.id);
      let currentData = [];
      let newData = [];

      gridObj.gridOptions.api.forEachNode((rowNode, index) => {
        currentData.push(rowNode.data);
      });

      if (isUp) {//вверх
        if (rowId == 0) {
          newData.push({});
          newData = newData.concat(currentData);
        }
        else {
          newData = currentData.slice(0, rowId);
          newData.push({});
          newData = newData.concat(currentData.slice(rowId, currentData.length + 1));
        }
      }

      if (!isUp) {//вниз
        if (rowId == currentData.length - 1) {
          newData = newData.concat(currentData);
          newData.push({});
        }
        else {
          newData = currentData.slice(0, rowId + 1);
          newData.push({});
          newData = newData.concat(currentData.slice(rowId + 1, currentData.length + 1));
        }
      }

      gridObj.gridOptions.api.setRowData(newData);

      const selectedRowIdx = isUp ? rowId : rowId + 1;
      gridObj.gridOptions.api.selectIndex (selectedRowIdx, true, false);
      gridObj.gridOptions.api.ensureIndexVisible(selectedRowIdx);

    }

    _deleteRow(gridObj) {
      const rowNode = gridObj.gridOptions.api.getSelectedNodes()[0];
      const rowId = Number(rowNode.id);
      let currentData = [];
      let newData = [];

      gridObj.gridOptions.api.forEachNode((rowNode, index) => {
        currentData.push(rowNode.data);
      });

      newData = currentData.slice(0, rowId);
      newData = newData.concat(currentData.slice(rowId + 1, currentData.length + 1));

      gridObj.gridOptions.api.setRowData(newData);

      const selectedRowIdx = (rowId == currentData.length - 1) ? rowId - 1 : rowId;
      gridObj.gridOptions.api.selectIndex (selectedRowIdx, true, false);
      gridObj.gridOptions.api.ensureIndexVisible(selectedRowIdx);
    }

}