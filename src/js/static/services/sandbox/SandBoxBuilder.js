import ServiceBuilder from "../ServiceBuilder";
import {Grid} from 'ag-grid-community';
import Properties from "../../../properties/Properties";
import { Number } from "core-js";
import Dialog from "../../../common/dialogs/Dialog";

/**
 * Сервис Песочницы
 */
export default class SandBoxBuilder extends ServiceBuilder {

  //фабрика представлений
  _viewFactory;

  //набор вкладок представления тетради
  _noteBookWindow;
  _tabIncome;
  _tabFlow;
  _tabOutcome;


  // набор вкладок представления набора тетрадей
  _noteBooksContainer;

  // Текущая активная тетрадь
  _curentNotebookWindow;

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

  _menuCalc;

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
   * Пункт меню "Сохранить копию"
   */
   _menuSaveAsCopy;

   /**
   * Пункт меню "печать"
   */
    _menuPrint;

  /**
   * Меню Свойства
   */
  _menuProperties;

  /**
   * Пункт меню "Поделиться"
   */
  _menuShare;

  /**
   * Пункт меню "Открыть"
   */
  _menuOpen;

  /**
   * Пункт меню "Создать"
   */
  _menuNew;

  /**
   * Функция пересчета ячеек документа
   */
  _calcFunction;

  /**
   * Функция сохранения документа
   */
  _saveFunction;

  /**
   * Функция сохранения копии
   */
  _saveCopyFunction;

  /**
   * Функция печати документа
   */
   _printFunction;

  /**
   * Функция публикации документа
   */
  _shareFunction;

  /**
   * Функция загрузки документа
   */
  _loadFunction;

  /**
   * Функция обновления содержимого тетради
   */
   _fileContentFunction;

   /**
    * Функция работы с рейтингом тетради
    */
   _likeFunction;

   /**
    * Функция отрабатывающая при завершении редактировании ячейки
    */
   _cellEditingFunction;

   /**
    * функция провери данных тетради
    */
   _checkModelFunctioin;

   /**
    * Функция автосохранения
    */
   _autoSaveFunction;

  /**
   * Компоненты характеристик файла
   */
  _fileNameComponent;
  _fileLastUpdateComponent;
  _fileContentComponent;
  _fileShareComponent;

  _fileLikeComponent;
  _fileLikesCountComponent;
  _fileViewsComponent;


  constructor(props) {
    super(props);
    this._calcFunction = this._props.calcFunction;
    this._saveFunction = this._props.saveFunction;
    this._saveCopyFunction = this._props.saveCopyFunction;
    this._printFunction = this._props.printFunction;
    this._shareFunction = this._props.shareFunction;
    this._loadFunction = this._props.loadFunction;
    this._fileContentFunction = this._props.fileContentFunction;
    this._currentDocument = this._props.currentDocument;
    this._shareFunction = this._props.shareFunction;
    this._createAndShowShareLink = this._props.createAndShowShareLink;
    this._likeFunction = this._props.likeFunction;
    this._cellEditingFunction = this._props.cellEditingFunction;
    this._checkModelFunctioin = this._props.checkModelFunction;
    this._viewFactory = this._props.viewFactory;
    // this._autoSaveFunction = this._props.autoSaveFunction;
    // setInterval(this.autoSaveDocument, Properties.sandBox.autoSaveInterval);
  }

  createDOM() {
    super.createDOM();

    this._createServiceMenu();
    this._setUpMenuItems();

    this._createOpeningGrid();
    this._createFlowsGrid();
    this._createClosingGrid();

    this._createNotebooksContainer();
    this._setUpNoteBookTabsEvent();
    this._setUpFileContentItem();
    this._setUpFileShareComponent();
  }

  /**
   * Создает меню сервиса
   */
  _createServiceMenu() {
    const menuHtml = this._viewFactory.getSandBoxMenuHTML();
    this._serviceMenu.insertAdjacentHTML(`afterbegin`, menuHtml);
    this._fileLikeComponent = this._serviceMenu.querySelector('.like');
    this._fileLikesCountComponent = this._serviceMenu.querySelector('.likes-counter');
    this._fileViewsComponent = this._serviceMenu.querySelector('.views-counter');
    this._fileShareComponent = this._serviceMenu.querySelector('.sharestatus');
  }

  /**
   * Создает таблицу входящих остатков
   */
  _createOpeningGrid() {
    this._openingGridElement = this._createGridElement(`${Properties.lang.dict.sandbox.grids.incomeTitle}`,'opening-grid');
    const gridOptions = this._getStockGridOptions();
    this._openingGridObject = this._createGridObject(this._openingGridElement, gridOptions);
  }

  /**
   * Создает таблицу оборотов
   */
  _createFlowsGrid() {
    this._flowGridElement = this._createGridElement(`${Properties.lang.dict.sandbox.grids.flowTitle}`, 'flow-grid');
    const gridOptions = this._getFlowGridOptions();
    this._flowGridObject = this._createGridObject(this._flowGridElement, gridOptions);
  }

  /**
   * Создает таблицу исходящих остатков
   */
  _createClosingGrid() {
    this._closeingGridElement = this._createGridElement(`${Properties.lang.dict.sandbox.grids.outcomeTitle}`,'closeing-grid');
    const gridOptions = this._getStockGridOptions();
    this._closeingGridObject = this._createGridObject(this._closeingGridElement, gridOptions);
  }

  /**
   * Создает набор вкладок для тетрадей
   */
  _createNotebooksContainer() {
    const tabsHtml = this._viewFactory.getNotebookTabsHTML();
    this._serviceView.insertAdjacentHTML('beforeend', tabsHtml);
    this._noteBooksContainer = this._serviceView.querySelector('.tabs-container.tabs-container-notebooks');

    this._addNotebook(null); //первоночально - пустой документ
  }

  _addNotebook(doc) {

    let docHtml = this._viewFactory.getSandBoxTabsContainerHTML();
    this._noteBooksContainer.insertAdjacentHTML('beforeend', docHtml);

    this._noteBookWindow = this._noteBooksContainer.querySelector('.tabs-container-notebook-items');
    this._tabIncome = this._noteBookWindow.querySelector('.tabs-container__item_income');
    this._tabFlow = this._noteBookWindow.querySelector('.tabs-container__item_flows');
    this._tabOutcome = this._noteBookWindow.querySelector('.tabs-container__item_outcome');

    this._tabIncome.insertAdjacentElement('beforeend', this._openingGridElement);
    this._tabFlow.insertAdjacentElement('beforeend', this._flowGridElement);
    this._tabOutcome.insertAdjacentElement('beforeend', this._closeingGridElement);

    this._setUpNoteBookTabsEvent();

    this._fileNameComponent = this._noteBooksContainer.querySelector('.file-name');
    this._fileLastUpdateComponent = this._noteBooksContainer.querySelector('.file-date');

    this._fileContentComponent = this._noteBooksContainer.querySelector('.description');
    // this._fileShareComponent = this._noteBooksContainer.querySelector('.sharestatus');

    if (!doc) {
      this.getProps().newSBFunction.call(this);
    }
  }

  /**
   * Создает элемент Grid с заданным заголовком и классом
   * @param {string} title заголовок Grid
   * @param {string} className имя класса элемента
   * @return {Element} элемент Grid
   */
  _createGridElement(title, className) {
    const el = document.createElement('div');
    el.classList.add(`${className}`);
    el.classList.add(`ag-theme-alpine`);
    el.style.height = '50vh';
    el.style.width = '100%';
    return el;
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
    grid.gridOptions.api.addEventListener('cellEditingStopped', () => {
      const incomeArr = this.getStockGridData(this._openingGridObject);
      const outcomeArr = this.getStockGridData(this._closeingGridObject);
      const flowsArr = this.getFlowGridData(this._flowGridObject);
      this._cellEditingFunction.call(this, incomeArr, outcomeArr, flowsArr);
      this.checkModelAndRender(incomeArr, outcomeArr, flowsArr);
    });
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
        pinned: 'left',
      },

      { headerName: `${Properties.lang.dict.sandbox.grids.account}`, field: 'accountNumber', resizable: true, editable: true, rowDrag: true, width: Properties.sandBox.grid.accColWidth,},
      { headerName: `${Properties.lang.dict.sandbox.grids.debitStock}`, field: 'debet', resizable: true, editable: true, valueFormatter: this.currencyFormatter, width: Properties.sandBox.grid.numberColWidth, },
      { headerName: `${Properties.lang.dict.sandbox.grids.creditStock}`, field: 'credit', resizable: true, editable: true, valueFormatter: this.currencyFormatter, width: Properties.sandBox.grid.numberColWidth, },
      { headerName: `${Properties.lang.dict.sandbox.grids.note}`, field: 'note', resizable: true, editable: true, tooltipValueGetter: this.toolTipValueGetter, minWidth: Properties.sandBox.grid.minTextColWidth,/*wrapText: true, autoHeight: true,*/},

    ];

    return this.getGridOptions(columnDefs);
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

      { headerName: `${Properties.lang.dict.sandbox.grids.flowNote}`, field: 'operationDesc', resizable: true, editable: true, rowDrag: true, tooltipValueGetter: this.toolTipValueGetter, minWidth: Properties.sandBox.grid.minTextColWidth, /*wrapText: true, autoHeight: true,*/},
      { headerName: `${Properties.lang.dict.sandbox.grids.accDebit}`, field: 'debet', resizable: true, editable: true, width: Properties.sandBox.grid.accColWidth,},
      { headerName: `${Properties.lang.dict.sandbox.grids.accCredit}`, field: 'credit', resizable: true, editable: true, width: Properties.sandBox.grid.accColWidth,},
      { headerName: `${Properties.lang.dict.sandbox.grids.summ}`, field: 'summ', resizable: true, editable: true, valueFormatter: this.currencyFormatter, width: Properties.sandBox.grid.numberColWidth,},
      { headerName: `${Properties.lang.dict.sandbox.grids.note}`, field: 'note', resizable: true, editable: true, tooltipValueGetter: this.toolTipValueGetter, minWidth: Properties.sandBox.grid.minTextColWidth, /*wrapText: true, autoHeight: true,*/},

    ];

    return this.getGridOptions(columnDefs);
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
   * Инициация пунктов меню и обработчиков событий меню
   */
  _setUpMenuItems() {
    this._setUpMenuItemCalc();
    this._setUpMenuItemSave();
    this._setUpMenuItemSaveCopy();
    this._setUpMenuItemPrint();
    this._setUpMenuItemOpen();
    this._setUpMenuItemNew();
    this._setUpMenuItemShare();
    this._setUpMenuItemProperties();
    this._setUpLikeComponent();
  }

  /**
   * Настройка меню Рассчитать
   */
  _setUpMenuItemCalc() {

    this._menuCalc = this._serviceMenu.querySelector('.menu-item-calc');
    let subMenuList = this._serviceMenu.querySelector('.submenu-list-calc');
    this._menuCalcIncome = this._serviceMenu.querySelector('.submenu-item-calc-income');
    this._menuCalcOutcome = this._serviceMenu.querySelector('.submenu-item-calc-outcome');

    this._menuCalc.addEventListener('click', () => {
      this._menuCalc.nextElementSibling.classList.toggle('service-section__submenu-list_is-visible');
    });

    subMenuList.addEventListener('mouseleave', (event) => {
      subMenuList.classList.remove('service-section__submenu-list_is-visible');
      event.preventDefault();
    });

    this._menuCalcIncome.addEventListener('click', () => {
      this._menuCalcIncome.parentElement.parentElement.classList.remove('service-section__submenu-list_is-visible');
      const result = this._calcStock(0);
      this.setStockGridData(this._openingGridObject, result, true);
      this.getDataCheckModelAndRender() ;
    })

    this._menuCalcOutcome.addEventListener('click', () => {
      this._menuCalcIncome.parentElement.parentElement.classList.remove('service-section__submenu-list_is-visible');
      const result = this._calcStock(2);
      this.setStockGridData(this._closeingGridObject, result, false);
      this.getDataCheckModelAndRender();
    })

  }

  /**
   * @param {Number} calcMode режим расчета (0 - входящие, 2 - исходящие)
   * @returns перерасчитанные остатки
   */
  _calcStock(calcMode) {
    const income = this.getStockGridData(this._openingGridObject);
    const outcome = this.getStockGridData(this._closeingGridObject);
    const flows = this.getFlowGridData(this._flowGridObject);
    return this._calcFunction.call(this, income, flows, outcome, calcMode);
  }

  /**
   * Настройка меню Сохранить
   */
  _setUpMenuItemSave() {
    this._menuSave = this._serviceMenu.querySelector('.menu-item-save');
    this._menuSave.addEventListener('click', () => {

      let preloader = this.getProps().preloader;
      this._componentDOM.appendChild(preloader);

      const income = this.getStockGridData(this._openingGridObject);
      const outcome = this.getStockGridData(this._closeingGridObject);
      const flows = this.getFlowGridData(this._flowGridObject);

      this._saveFunction.call(this, income, flows, outcome)
      .then((res) => {
        preloader.remove();
      })
      .catch((err) => {
        preloader.remove();
        this.handleError(err);
      });
    })
  }

  /**
   * Настройка меню Сохранить как
   */
   _setUpMenuItemSaveCopy() {
    this._menuSaveAsCopy = this._serviceMenu.querySelector('.menu-item-saveascopy');
    this._menuSaveAsCopy.addEventListener('click', () => {

       let preloader = this.getProps().preloader;
       this._componentDOM.appendChild(preloader);

       const income = this.getStockGridData(this._openingGridObject);
       const outcome = this.getStockGridData(this._closeingGridObject);
       const flows = this.getFlowGridData(this._flowGridObject);

       this._saveCopyFunction.call(this, income, flows, outcome)
       .then((res) => {
         preloader.remove();
       })
       .catch((err) => {
         preloader.remove();
         this.handleError(err);
       });
    })
  }

  /**
   * Настройка меню Печать
   */
   _setUpMenuItemPrint() {
    this._menuPrint = this._serviceMenu.querySelector('.menu-item-print');
    this._menuPrint.addEventListener('click', () => {
       this._printFunction.call(this, []);
    })
  }

  /**
   * Настройка меню Открыть
   */
  _setUpMenuItemOpen() {
    this._menuOpen = this._serviceMenu.querySelector('.menu-item-open');
    this._menuOpen.addEventListener('click', () => {
      this._openEvent();
    })
  }

  _openEvent() {
    let preloader = this.getProps().preloader;
    this._componentDOM.appendChild(preloader);

    this.getProps().openSBFunction.call(this)
    .then((res) => {
      preloader.remove();
    })
    .catch((err) => {
      preloader.remove();
      this.handleError(err);
    });
  }

  /**
   * Настройка меню Создать
   */
  _setUpMenuItemNew() {
    this._menuNew = this._serviceMenu.querySelector('.menu-item-new');
    this._menuNew.addEventListener('click', () => {
      this.getProps().newSBFunction.call(this);
    })
  }

  /**
   * Обработчик определения описания тетради
   */
  _setUpFileContentItem() {
    this._fileContentComponent.addEventListener('click', () => {
      this._fileContentFunction.call(this);
    })
  }

  /**
   * Настройка меню Поделиться
   */
   _setUpMenuItemShare() {

    this._menuShare = this._serviceMenu.querySelector('.menu-item-share');
    this._menuShare.addEventListener('click', () => {

      let preloader = this.getProps().preloader;
      this._componentDOM.appendChild(preloader);

      this._shareFunction.call(this)
      .then((res) => {
        preloader.remove();
      })
      .catch((err) => {
        preloader.remove();
        this.handleError(err);
      });
    });
  }

  /**
   * Обработчик определения описания тетради
   */
   _setUpFileShareComponent() {
    this._fileShareComponent.addEventListener('click', () => {
      this._createAndShowShareLink.call(this);
    })
  }

  /**
   * Насторойка меню Свойства
   */
  _setUpMenuItemProperties() {
    this._menuProperties = this._serviceMenu.querySelector('.menu-item-properties');
    this._menuProperties.addEventListener('click', () => {
      this._fileContentFunction.call(this);
    });
  }

  /**
   * Настройка рейтинга
   */
  _setUpLikeComponent() {
    this._fileLikeComponent.addEventListener('click', () => {

      let preloader = this.getProps().preloader;
      this._componentDOM.appendChild(preloader);

      this._likeFunction.call(this)
      .then((res) => {
        preloader.remove();
        this.setLikesCount(res.count);
      })
      .catch((err) => {
        preloader.remove();
        this.handleError(err);
      });

    });
  }

  // обработчик панели вкладок
  _setUpNoteBookTabsEvent() {
    const tabLinks = this._noteBookWindow.querySelectorAll(".tabs-container__button");
    const tabPanels = this._noteBookWindow.querySelectorAll(".tabs-container__item");

    for(let el of tabLinks) {

      el.addEventListener("click", e => {
        e.preventDefault();
        this._noteBookWindow.querySelector('.tabs-container__button.tabs-container__button_active.tabs-container__button_active-bottom').classList.remove("tabs-container__button_active", "tabs-container__button_active-bottom");
        this._noteBookWindow.querySelector('.tabs-container__item.tabs-container__item_active').classList.remove("tabs-container__item_active");
        el.classList.add("tabs-container__button_active", "tabs-container__button_active-bottom");
        // ищем связанную панель
        const index = el.getAttribute('id');
        const panel = [...tabPanels].filter(el => el.getAttribute("data-index") == index);
        panel[0].classList.add("tabs-container__item_active");
        //ровняем таблицу
        this._openingGridObject.gridOptions.api.sizeColumnsToFit();
        this._flowGridObject.gridOptions.api.sizeColumnsToFit();
        this._closeingGridObject.gridOptions.api.sizeColumnsToFit();
      });
    }
  }

  /**
   * Автосохранение документа
   */
  autoSaveDocument = () => {
    let preloader = this.getProps().preloader;
    this._componentDOM.appendChild(preloader);

    const income = this.getStockGridData(this._openingGridObject);
    const outcome = this.getStockGridData(this._closeingGridObject);
    const flows = this.getFlowGridData(this._flowGridObject);

    if (this._autoSaveFunction instanceof Function) {
      this._autoSaveFunction.call(this, income, flows, outcome)
      .then((res) => {
        preloader.remove();
      })
      .catch((err) => {
        preloader.remove();
        this.handleError(err);
      });
    }
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
    this._clearGridData(gridObj)

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

    this._clearGridData(gridObj);

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
  _clearGridData(gridObj) {
    const rowData = [];
    gridObj.gridOptions.api.setRowData(rowData);
  }

  loadData(doc) {
    this.setStockGridData(this._openingGridObject, doc.text.income, true);
    this.setFlowGridData(this._flowGridObject, doc.text.flows);
    this.setStockGridData(this._closeingGridObject, doc.text.outcome, false);

    this._fileNameComponent.textContent = doc._id ? doc._id : `${Properties.lang.dict.notebook.noname}`;

    this._fileContentComponent.textContent = doc.properties.shortdesc;
    this._fileLikesCountComponent.textContent = doc.likes.length;
    this._fileViewsComponent.textContent = doc.views;

    this._fileLastUpdateComponent.textContent = new Date(doc.lastupdate).toLocaleString();
    this.setShareStatus(doc.share == null ? false : doc.share);
  }

  getData() {
    return {
      docId: this._fileNameComponent.textContent,
      docDescription: this._fileContentComponent.textContent,
      lustUpdate: this._fileLastUpdateComponent.textContent,
      income: this.getStockGridData(this._openingGridObject),
      flows: this.getFlowGridData(this._flowGridObject),
      outcome: this.getStockGridData(this._closeingGridObject),
      share: this.getShareStatus(),
    }
  }

  getDataCheckModelAndRender() {
    const incomeArr = this.getStockGridData(this._openingGridObject);
    const outcomeArr = this.getStockGridData(this._closeingGridObject);
    const flowsArr = this.getFlowGridData(this._flowGridObject);
    this.checkModelAndRender(incomeArr, outcomeArr, flowsArr);
  }

  checkModelAndRender = (incomeArr, outcomeArr, flowsArr) => {
    let checkResult = this._checkModel(incomeArr, outcomeArr, flowsArr);
    this._renderCheckList(checkResult);
  }

  /**
   * проверяет данные модели
   */
  _checkModel = (incomeArr, outcomeArr, flowsArr) => {
    return this._checkModelFunctioin.call(this, incomeArr, outcomeArr, flowsArr);
  }

  /**
   * Визуализирует результаты проверки
   * @param {Object} checkResult объект результатов проверки
   */
  _renderCheckList = (checkResult) => {
    const errorStyle = 'tabs-container__button_error';
    //проверяем входящий
    if (checkResult.incomeBalanced) {
      this._serviceView.querySelector('.tabs-container__button_income').classList.add(`${errorStyle}`);
    }
    else {
      this._serviceView.querySelector('.tabs-container__button_income').classList.remove(`${errorStyle}`);
    }
    //проверяем исходящий
    if (checkResult.outcomeBalanced) {
      this._serviceView.querySelector('.tabs-container__button_outcome').classList.add(`${errorStyle}`);
    }
    else {
      this._serviceView.querySelector('.tabs-container__button_outcome').classList.remove(`${errorStyle}`);
    }
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

  /**
   * Пользовательский обработчик ошибки с сервера
   * @param {Object} err
   */
  handleError(err) {
    if (!err instanceof Error) {
      Dialog.ErrorDialog(`${Properties.lang.dict.errors.error}: ${err.statusText} (${Properties.lang.dict.errors.code}: ${err.status})`);
    }
    else {
      //если не авторизированы - авторизируем
      if (err.status == 401) {
        this.getProps().loginFunction.call(this);
      }
      else {
        Dialog.ErrorDialog(`${Properties.lang.dict.errors.error}: ${err.message}`);
      }
    }
  }

  getShareStatus() {
    return this._fileShareComponent.textContent ? true : false;
  }

  setShareStatus(status) {
    // status ? this._fileShareComponent.textContent = `(${Properties.lang.dict.notebook.share})` : this._fileShareComponent.textContent = '';
    status ? this._fileShareComponent.classList.remove('service-section__menu-item_not-visible') : this._fileShareComponent.classList.add('service-section__menu-item_not-visible');
    status ? this._menuShare.lastChild.nodeValue = `${Properties.lang.dict.sandbox.menu.unshare}` : this._menuShare.lastChild.nodeValue = `${Properties.lang.dict.sandbox.menu.share}`;
  }

  setLikesCount(count) {
    this._fileLikesCountComponent.textContent = count;
  }

  getLikesCount() {
    return this._fileLikesCountComponent.textContent;
  }

  // проверяет, являются ли все объекты массива пустыми
  isNotEmptyObj(obj) {

    for (var key of Object.keys(obj)) {
      if (obj[key]) {
        return true;
      }
    }
    return false;
  }

}