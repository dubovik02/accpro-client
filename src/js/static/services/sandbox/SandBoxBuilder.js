import ServiceBuilder from "../ServiceBuilder";
import {Grid} from 'ag-grid-community';
import Properties from "../../../properties/Properties";
import Dialog from "../../../common/dialogs/Dialog";

/**
 * Сервис Песочницы
 */
export default class SandBoxBuilder extends ServiceBuilder {

  // фабрика представлений
  _viewFactory;

  // построитель табличных представлений
  _gridBuilder;

  // набор вкладок представления тетради
  _noteBookWindow;
  _tabIncome;
  _tabFlow;
  _tabOutcome;


  // набор вкладок представления набора тетрадей
  _noteBooksContainer;

  /**
   * Таблица входящих остатков
   */
  _incomeGridObject;

  /**
   * Элемент таблицы входящих остатков
   */
  _incomeGridElement;

  /**
   * Таблица исходящих остатков
   */
  _outcomeGridObject;

  /**
   * Элемент таблицы исходящих остатков
   */
  _outcomeGridElement;

  /**
   * Таблица оборотов
   */
  _flowsGridObject;

  /**
   * Элемент таблицы оборотов
   */
  _flowsGridElement;

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
    this._gridBuilder = this._props.gridBuilder;
    this._autoSaveFunction = this._props.autoSaveFunction;
    setInterval(this.autoSaveDocument, Properties.sandBox.autoSaveInterval);
  }

  createDOM() {
    super.createDOM();
    this._createServiceMenu();
    this._setUpMenuItems();

    this._createIncomeGrid();
    this._createFlowsGrid();
    this._createOutcomeGrid();

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
  _createIncomeGrid() {
    this._incomeGridElement = this._gridBuilder.createGridElement('opening-grid');
    const gridOptions = this._gridBuilder.getStockGridOptions();
    this._incomeGridObject = this._gridBuilder.createGridObject(this._incomeGridElement, gridOptions);
    this._setUpCellEditingFunction(this._incomeGridObject);
  }

  /**
   * Создает таблицу оборотов
   */
  _createFlowsGrid() {
    this._flowsGridElement = this._gridBuilder.createGridElement('flow-grid');
    const gridOptions = this._gridBuilder.getFlowGridOptions();
    this._flowsGridObject = this._gridBuilder.createGridObject(this._flowsGridElement, gridOptions);
    this._setUpCellEditingFunction(this._flowsGridObject);
  }

  /**
   * Создает таблицу исходящих остатков
   */
  _createOutcomeGrid() {
    this._outcomeGridElement = this._gridBuilder.createGridElement('closeing-grid');
    const gridOptions = this._gridBuilder.getStockGridOptions();
    this._outcomeGridObject = this._gridBuilder.createGridObject(this._outcomeGridElement, gridOptions);
    this._setUpCellEditingFunction(this._outcomeGridObject);
  }

  /**
   * Создает набор вкладок для тетрадей
   */
  _createNotebooksContainer() {
    const tabsHtml = this._viewFactory.getNotebookTabsHTML();
    this._serviceView.insertAdjacentHTML('beforeend', tabsHtml);
    this._noteBooksContainer = this._serviceView.querySelector('.tabs-container.tabs-container-notebooks');

    this._addNotebook(); //первоночально - пустой документ
  }

  _addNotebook() {

    let docHtml = this._viewFactory.getSandBoxTabsContainerHTML();
    this._noteBooksContainer.insertAdjacentHTML('beforeend', docHtml);

    this._noteBookWindow = this._noteBooksContainer.querySelector('.tabs-container-notebook-items');
    this._tabIncome = this._noteBookWindow.querySelector('.tabs-container__item_income');
    this._tabFlow = this._noteBookWindow.querySelector('.tabs-container__item_flows');
    this._tabOutcome = this._noteBookWindow.querySelector('.tabs-container__item_outcome');

    this._tabIncome.insertAdjacentElement('beforeend', this._incomeGridElement);
    this._tabFlow.insertAdjacentElement('beforeend', this._flowsGridElement);
    this._tabOutcome.insertAdjacentElement('beforeend', this._outcomeGridElement);

    this._setUpNoteBookTabsEvent();

    this._fileNameComponent = this._noteBooksContainer.querySelector('.file-name');
    this._fileLastUpdateComponent = this._noteBooksContainer.querySelector('.file-date');

    this._fileContentComponent = this._noteBooksContainer.querySelector('.description');
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
      this._gridBuilder.setStockGridData(this._incomeGridObject, result, true);
      this.getDataCheckModelAndRender();
    });

    this._menuCalcOutcome.addEventListener('click', () => {
      this._menuCalcIncome.parentElement.parentElement.classList.remove('service-section__submenu-list_is-visible');
      const result = this._calcStock(2);
      this._gridBuilder.setStockGridData(this._outcomeGridObject, result, false);
      this.getDataCheckModelAndRender();
    });

  }

  /**
   * @param {Number} calcMode режим расчета (0 - входящие, 2 - исходящие)
   * @returns перерасчитанные остатки
   */
  _calcStock(calcMode) {
    const { income, outcome, flows } =
      this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);
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

      const { income, outcome, flows } = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);

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

       const { income, outcome, flows } = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);

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
        this._incomeGridObject.gridOptions.api.sizeColumnsToFit();
        this._flowsGridObject.gridOptions.api.sizeColumnsToFit();
        this._outcomeGridObject.gridOptions.api.sizeColumnsToFit();
      });
    }
  }

  /**
   * Устанавливает обработчик на редактирование ячейки грида
   * @param {Grid} gridObject
   */
  _setUpCellEditingFunction(gridObject) {
    gridObject.gridOptions.api.addEventListener('cellEditingStopped', () => {
      const { income, outcome, flows } = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);
      this._cellEditingFunction.call(this, income, outcome, flows);
      this.checkModelAndRender(income, outcome, flows);
    });
  }

/**
 * Автосохранение документа
 */
  autoSaveDocument = () => {
    let preloader = this.getProps().preloader;
    this._componentDOM.appendChild(preloader);

    const { income, outcome, flows } = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);

    if (this._saveFunction instanceof Function) {
      this._saveFunction.call(this, income, flows, outcome)
      .then((res) => {
        preloader.remove();
      })
      .catch((err) => {
        preloader.remove();
      });
    }
  }

  /**
   * Обоработчик переключения с текущего представления
   */
  onLeave = () => {
    const { income, outcome, flows }
      = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);

    return this._autoSaveFunction.call(this, income, flows, outcome);
  }

  loadData(doc) {
    this._gridBuilder.setStockGridData(this._incomeGridObject, doc.text.income, true);
    this._gridBuilder.setFlowGridData(this._flowsGridObject, doc.text.flows);
    this._gridBuilder.setStockGridData(this._outcomeGridObject, doc.text.outcome, false);

    this._fileNameComponent.textContent = doc._id ? doc._id : `${Properties.lang.dict.notebook.noname}`;
    this._fileContentComponent.textContent = doc.properties.shortdesc;
    this._fileLikesCountComponent.textContent = doc.likes.length;
    this._fileViewsComponent.textContent = doc.views;

    this._fileLastUpdateComponent.textContent = new Date(doc.lastupdate).toLocaleString();
    this.setShareStatus(doc.share == null ? false : doc.share);
    //проверяем балансы остатков
    const { income, outcome, flows } = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);
    this.checkModelAndRender(income, outcome, flows);
  }

  getData() {
    return {
      docId: this._fileNameComponent.textContent,
      docDescription: this._fileContentComponent.textContent,
      lustUpdate: this._fileLastUpdateComponent.textContent,
      income: this._gridBuilder.getStockGridData(this._incomeGridObject),
      flows: this._gridBuilder.getFlowGridData(this._flowsGridObject),
      outcome: this._gridBuilder.getStockGridData(this._outcomeGridObject),
      share: this.getShareStatus(),
    }
  }

  getDataCheckModelAndRender() {
    const { income, outcome, flows } = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);
    this.checkModelAndRender(income, outcome, flows);
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
    status ? this._fileShareComponent.classList.remove('service-section__menu-item_not-visible') : this._fileShareComponent.classList.add('service-section__menu-item_not-visible');
    status ? this._menuShare.lastChild.nodeValue = `${Properties.lang.dict.sandbox.menu.unshare}` : this._menuShare.lastChild.nodeValue = `${Properties.lang.dict.sandbox.menu.share}`;
  }

  setLikesCount(count) {
    this._fileLikesCountComponent.textContent = count;
  }

  getLikesCount() {
    return this._fileLikesCountComponent.textContent;
  }

}