import ServiceBuilder from "../ServiceBuilder";
import {Grid} from 'ag-grid-community';
import Properties from "../../../properties/Properties";
import { Number } from "core-js";
import Dialog from "../../../common/dialogs/Dialog";
import like from "../../../../images/like32.png";
import view from "../../../../images/view64.png";

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
    super(props)
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
  }

  createDOM() {
    super.createDOM();
    this._createStatusBar();
    this._createServiceMenu();
    this._createOpeningGrid();
    this._createFlowsGrid();
    this._createClosingGrid();
  }

  /**
   * Создает статусную панель (имя файла, автор, создан, сохранен и т.п.)
   */
  _createStatusBar() {

    const centerStatusBarHtml = `
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
                                    <img class="service-section__icon service-section__icon_linked like" src="${like}">
                                    <span class="service-section__span likes-counter"></span>
                                  </div>
                                  <div class="service-section__icon-container">
                                    <img class="service-section__icon" src="${view}">
                                    <span class="service-section__span views-counter"></span>
                                  </div>
                                </div>

                                `;

    this._leftContainer.insertAdjacentHTML('afterbegin', centerStatusBarHtml);

    this._fileNameComponent = this._leftContainer.querySelector('.file-name');
    this._fileLastUpdateComponent = this._leftContainer.querySelector('.file-date');
    this._fileContentComponent = this._leftContainer.querySelector('.description');
    this._fileShareComponent = this._leftContainer.querySelector('.sharestatus');
    this._fileLikeComponent = this._leftContainer.querySelector('.like');
    this._fileLikesCountComponent = this._leftContainer.querySelector('.likes-counter');
    this._fileViewsComponent = this._leftContainer.querySelector('.views-counter');

  }

  /**
   * Создает меню сервиса
   */
  _createServiceMenu() {

    const menuHtml = `<ul class="service-section__menu-list">

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

    this._serviceMenu.insertAdjacentHTML(`afterbegin`, menuHtml);
    this._setUpMenuItems();

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
   * Создает элемент Grid с заданным заголовком и классом
   * @param {string} title заголовок Grid
   * @param {string} className имя класса элемента
   * @return {Element} элемент Grid
   */
  _createGridElement(title, className) {
    const gridHtml = `<p class="grid__title grid__title-${className}">${title}</p>
                      <div style="height: 270px; max-width: 100%;" class="${className} ag-theme-alpine"></div>`;
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

      { headerName: `${Properties.lang.dict.sandbox.grids.account}`, field: 'accountNumber', resizable: true, editable: true, rowDrag: true, },
      { headerName: `${Properties.lang.dict.sandbox.grids.debitStock}`, field: 'debet', resizable: true, editable: true, valueFormatter: this.currencyFormatter,},
      { headerName: `${Properties.lang.dict.sandbox.grids.creditStock}`, field: 'credit', resizable: true, editable: true, valueFormatter: this.currencyFormatter,},
      { headerName: `${Properties.lang.dict.sandbox.grids.note}`, field: 'note', resizable: true, editable: true, tooltipValueGetter: this.toolTipValueGetter,/*wrapText: true, autoHeight: true,*/ },

    ];

    // specify the default row data count
    const rowData = [];

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

      { headerName: `${Properties.lang.dict.sandbox.grids.flowNote}`, field: 'operationDesc', resizable: true, editable: true, rowDrag: true, tooltipValueGetter: this.toolTipValueGetter,/*wrapText: true, autoHeight: true,*/},
      { headerName: `${Properties.lang.dict.sandbox.grids.accDebit}`, field: 'debet', resizable: true, editable: true, },
      { headerName: `${Properties.lang.dict.sandbox.grids.accCredit}`, field: 'credit', resizable: true, editable: true, },
      { headerName: `${Properties.lang.dict.sandbox.grids.summ}`, field: 'summ', resizable: true, editable: true, valueFormatter: this.currencyFormatter,},
      { headerName: `${Properties.lang.dict.sandbox.grids.note}`, field: 'note', resizable: true, editable: true, tooltipValueGetter: this.toolTipValueGetter, /*wrapText: true, autoHeight: true,*/},

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
    this._setUpFileContentItem();
    this._setUpMenuItemShare();
    this._setUpFileShareComponent();
    this._setUpMenuItemProperties();
    this._setUpLikeComponent();
  }

  /**
   * Настройка меню Рассчитать
   */
  _setUpMenuItemCalc() {

    this._menuCalcIncome = this._serviceMenu.querySelector('.submenu-item-calc-income');
    this._menuCalcOutcome = this._serviceMenu.querySelector('.submenu-item-calc-outcome');

    this._menuCalcIncome.addEventListener('click', () => {
      const result = this._calcStock(0);
      this.setStockGridData(this._openingGridObject, result, true);

    })

    this._menuCalcOutcome.addEventListener('click', () => {
      const result = this._calcStock(2);
      this.setStockGridData(this._closeingGridObject, result, false);
    })

  }

  /**
   * @param {Number} calcMode режим расчета (0 - входящие, 2 исходящие)
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

  /**
   * Возвращает данные из таблицы остатков
   * @param {Object} stockGrid - объект таблицы остатков
   */
  getStockGridData(stockGrid) {
    let totalObj = [];
    stockGrid.gridOptions.api.forEachNode((rowNode, index) => {
      let currentObj = {
        accountNumber: rowNode.data.accountNumber ? rowNode.data.accountNumber.trim() : rowNode.data.accountNumber,
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
    //проверяем входящий
    if (checkResult.incomeBalanced) {
      document.querySelector('.grid__title-opening-grid').classList.add('grid__title_color-red');
    }
    else {
      document.querySelector('.grid__title-opening-grid').classList.remove('grid__title_color-red');
    }
    //проверяем исходящий
    if (checkResult.outcomeBalanced) {
      document.querySelector('.grid__title-closeing-grid').classList.add('grid__title_color-red');
    }
    else {
      document.querySelector('.grid__title-closeing-grid').classList.remove('grid__title_color-red');
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

    valueNumb = new Intl.NumberFormat("ru-RU", {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(valueNumb);
    return valueNumb;
  }

  /**
   * Всплывающая подсказка (колл-бэк)
   */
  toolTipValueGetter = (params) =>
  params.value == null || params.value === "" ? "- Missing -" : params.value;

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
    status ? this._fileShareComponent.textContent = `(${Properties.lang.dict.notebook.share})` : this._fileShareComponent.textContent = '';
    status ? this._menuShare.textContent = `${Properties.lang.dict.sandbox.menu.unshare}` : this._menuShare.textContent = `${Properties.lang.dict.sandbox.menu.share}`;
  }

  setLikesCount(count) {
    this._fileLikesCountComponent.textContent = count;
  }

  getLikesCount() {
    return this._fileLikesCountComponent.textContent;
  }

}