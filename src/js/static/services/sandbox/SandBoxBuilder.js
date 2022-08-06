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
    props.serviceName = 'Бухгалтерская песочница';
    props.serviceDescription = 'Сервис совместной работы над бухгалтерским кодом - проводками';
    super(props)
    this._calcFunction = this._props.calcFunction;
    this._saveFunction = this._props.saveFunction;
    this._shareFunction = this._props.shareFunction;
    this._loadFunction = this._props.loadFunction;
    this._fileContentFunction = this._props.fileContentFunction;
    this._currentDocument = this._props.currentDocument;
    this._shareFunction = this._props.shareFunction;
    this._createAndShowShareLink = this._props.createAndShowShareLink;
    this._likeFunction = this._props.likeFunction;
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
                                  Тетрадь:
                                  <span class="service-section__span file-name"></span>
                                   |
                                  <span class="service-section__span file-date"></span>
                                </p>

                                <p class="service-section__description">
                                  Название:
                                  <span class="service-section__span service-section__span_file-description description"></span>
                                  <span class="service-section__span service-section__span_file-description sharestatus"></span>
                                </p>

                                <div class="service-section__icon-container">
                                  <div class="service-section__icon-container">
                                    <img class="service-section__icon like" src="${like}">
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
                          <a class="link service-section__link menu-item-new">Создать</a>
                        </li>
                        <li class="service-section__menu-item">
                          <a class="link service-section__link menu-item-properties">Свойства</a>
                        </li>
                        <li class="service-section__menu-item">
                          <a class="link service-section__link menu-item-open">Открыть</a>
                        </li>
                        <li class="service-section__menu-item">
                          <a class="link service-section__link  menu-item-save">Сохранить</a>
                        </li>
                        <li class="service-section__menu-item">
                          <a class="link service-section__link menu-item-share">Поделиться</a>
                        </li>
                        <li class="service-section__menu-item">
                          <a class="link service-section__link menu-item-calc">
                            Рассчитать
                          </a>

                          <ul class="service-section__submenu-list">
                            <li class="service-section__submenu-item">
                              <a class="link service-section__sublink submenu-item-calc-income">Входящие остатки</a>
                            </li>
                            <li class="service-section__submenu-item">
                              <a class="link service-section__sublink submenu-item-calc-outcome">Исходящие остатки</a>
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
    this._openingGridElement = this._createGridElement('Входящие остатки','opening-grid');
    const gridOptions = this._getStockGridOptions();
    this._openingGridObject = this._createGridObject(this._openingGridElement, gridOptions);
  }

  /**
   * Создает таблицу оборотов
   */
  _createFlowsGrid() {
    this._flowGridElement = this._createGridElement('Обороты', 'flow-grid');
    const gridOptions = this._getFlowGridOptions();
    this._flowGridObject = this._createGridObject(this._flowGridElement, gridOptions);
  }

  /**
   * Создает таблицу исходящих остатков
   */
  _createClosingGrid() {
    this._closeingGridElement = this._createGridElement('Исходящие остатки','closeing-grid');
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

      { headerName: 'Счет', field: 'accountNumber', resizable: true, editable: true,},
      { headerName: 'Остаток по дебету', field: 'debet', resizable: true, editable: true, valueFormatter: this.currencyFormatter,},
      { headerName: 'Остаток по кредиту', field: 'credit', resizable: true, editable: true, valueFormatter: this.currencyFormatter,},
      { headerName: 'Пояснение', field: 'note', resizable: true, editable: true },

    ];

    // specify the default row data count
    const rowData = [];

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

      { headerName: 'Содержание операции', field: 'operationDesc', resizable: true, editable: true,},
      { headerName: 'Счет по дебету', field: 'debet', resizable: true, editable: true,},
      { headerName: 'Счет по кредиту', field: 'credit', resizable: true, editable: true,},
      { headerName: 'Сумма', field: 'summ', resizable: true, editable: true, valueFormatter: this.currencyFormatter,},
      { headerName: 'Пояснение', field: 'note', resizable: true, editable: true,},

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
    this._setUpMenuItemSave();
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
   * Обработчик определенияя описания тетради
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

    this._fileNameComponent.textContent = doc._id ? doc._id : "Без имени";

    this._fileContentComponent.textContent = doc.properties.shortdesc;
    this._fileLikesCountComponent.textContent = doc.likes.length;
    //this._fileLikesCountComponent.textContent = doc.likes;
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

  /**
   * Пользовательский обработчик ошибки с сервера
   * @param {Object} err
   */
  handleError(err) {
    if (!err instanceof Error) {
      Dialog.ErrorDialog(`Ошибка: ${err.statusText} (Код: ${err.status})`);
    }
    else {
      //если не авторизированы - авторизируем
      if (err.status == 401) {
        this.getProps().loginFunction.call(this);
      }
      else {
        Dialog.ErrorDialog(`Ошибка: ${err.message}`);
      }
    }
  }

  getShareStatus() {
    return this._fileShareComponent.textContent ? true : false;
  }

  setShareStatus(status) {
    status ? this._fileShareComponent.textContent = '(Общий доступ)' : this._fileShareComponent.textContent = '';
    status ? this._menuShare.textContent = 'Спрятать' : this._menuShare.textContent = 'Поделиться';
  }

  setLikesCount(count) {
    this._fileLikesCountComponent.textContent = count;
  }

  getLikesCount() {
    return this._fileLikesCountComponent.textContent;
  }

}