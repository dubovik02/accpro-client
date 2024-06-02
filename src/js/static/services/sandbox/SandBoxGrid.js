import Properties from "../../../properties/Properties";
import {Grid} from 'ag-grid-community';

/**
 * Класс гридов сервиса Песочницы
 */
export default class SandBoxGrid {

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
    return grid;
  }

  /**
   * Создает объект Grid операций на базе соответсвующего элемента и объекта свойств
   * @param {Element} gridElement элемент
   * @param {Object} gridOptions объект свойств
   * @return {Grid} объект Grid
   */
  createFlowGridObject(className) {
    return this.createGridObject(this.createGridElement(className), this.getFlowGridOptions());
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
}