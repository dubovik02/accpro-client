import ServiceBuilder from "../ServiceBuilder";
import {createGrid, GridApi} from 'ag-grid-community';
import Properties from "../../../properties/Properties";
import Dialog from "../../../common/dialogs/Dialog";
import SandBoxViewFactory from "./SandBoxViewFactory";
import SandBoxGrid from "./SandBoxGrid";
import SandBoxDocument from "../../../common/documents/SandBoxDocument";
import { CalcTypes } from "./SandBoxEnum";
import { NotebookGridObject } from "./SandBoxGridObjects";
import SelectFromGridPopUp from "../../popups/SelectFromGridPopUp";
import FormsFactory from "../../../common/factories/FormsFactory";
import GridFactory from "../../../common/factories/GridFactory";
import InputMultiValuesPopUp from "../../popups/InputMultiValuesPopUp";
import FormInputsValidator from "../../../validators/FormInputsValidator";

/**
 * Сервис Песочницы
 */
export default class SandBoxBuilder extends ServiceBuilder {

  // фабрика представлений
  _viewFactory : SandBoxViewFactory;

  // построитель табличных представлений
  _gridBuilder : SandBoxGrid;

  // набор вкладок представления тетради
  _noteBookWindow : HTMLElement;
  _tabIncome : HTMLElement;
  _tabFlow : HTMLElement;
  _tabOutcome : HTMLElement;


  // набор вкладок представления набора тетрадей
  _noteBooksContainer  : HTMLElement;

  /**
   * Таблица входящих остатков
   */
  _incomeGridObject : GridApi;

  /**
   * Элемент таблицы входящих остатков
   */
  _incomeGridElement : HTMLDivElement;

  /**
   * Таблица исходящих остатков
   */
  _outcomeGridObject : GridApi;

  /**
   * Элемент таблицы исходящих остатков
   */
  _outcomeGridElement : HTMLDivElement;

  /**
   * Таблица оборотов
   */
  _flowsGridObject : GridApi;

  /**
   * Элемент таблицы оборотов
   */
  _flowsGridElement : HTMLDivElement;

  /**
   * Текущий документ
   */
  _currentDocument : SandBoxDocument;

  /**---------Пункт меню "Рассчитать"----------- */

  _menuCalc : HTMLElement;

  /**
   * Подпункт "Входящие остатки"
   */
  _menuCalcIncome : HTMLElement;

  /**
   * Подпункт "Обороты"
   */
   _menuCalcFlows : HTMLElement;

   /**
   * Подпункт "Исходящие остатки"
   */
    _menuCalcOutcome : HTMLElement;

   /**-------------------------------------------- */
  /**
   * Пункт меню "Сохранить"
   */
  _menuSave : HTMLElement;

  /**
   * Пункт меню "Сохранить копию"
   */
   _menuSaveAsCopy : HTMLElement;

   /**
   * Пункт меню "печать"
   */
  _menuPrint : HTMLElement;

  /**
   * Меню Свойства
   */
  _menuProperties : HTMLElement;

  /**
   * Пункт меню "Поделиться"
   */
  _menuShare : HTMLElement;

  /**
   * Пункт меню "Открыть"
   */
  _menuOpen : HTMLElement;

  /**
   * Пункт меню "Создать"
   */
  _menuNew : HTMLElement;

  /**
   * Меню обновить документ
   */
  _menuRefresh : HTMLElement;

  /**
   * Функция пересчета ячеек документа
   */
  _calcFunction : Function;

  /**
   * Функция сохранения документа
   */
  _saveFunction : Function;

  /**
   * Функция открытия документа
   */
  _openSandBoxFunction : Function;

  /**
   * Функция сохранения копии
   */
  _saveCopyFunction : Function;

  /**
   * Функция печати документа
   */
   _printFunction : Function;

  /**
   * Функция публикации документа
   */
  _shareFunction : Function;

  /**
   * Функция визуализации ссылки на тетрадь
   */
  _createShareLink : Function;

  /**
   * Функция обновления свойств тетради
   */
  _updateFileContentFunction : Function;

  /**
   * Функция загрузки документа
   */
  _loadFunction : Function;

  /**
   * Функция обновления содержимого тетради
   */
   _fileContentFunction : Function;

   /**
    * Функция работы с рейтингом тетради
    */
   _likeFunction : Function;

   /**
    * Функция отрабатывающая при завершении редактировании ячейки
    */
   _cellEditingFunction : Function;

   /**
    * функция провери данных тетради
    */
   _checkModelFunctioin : Function;

   /**
    * Функция автосохранения
    */
   _autoSaveFunction : Function;

   /**
    * Устанавливает параметры страницы при открытии документа
    */
   _setPagePropsFunction : Function;

   /**
    * Функция получения перечня документов пользоваителя
    */
   _getUserDocumentsFunction : Function;

   //коллбэк обновления документа
   _refreshFunction : Function;

  /**
   * Компоненты характеристик файла
   */
  _fileNameComponent : HTMLElement;
  _fileLastUpdateComponent : HTMLElement;
  _fileContentComponent : HTMLElement;
  _fileShareComponent : HTMLElement;

  _fileLikeComponent : HTMLElement;
  _fileLikesCountComponent : HTMLElement;
  _fileViewsComponent : HTMLElement;


  constructor(props : { [key: string]: any }) {
    super(props);
    this._calcFunction = this._props.calcFunction;
    this._saveFunction = this._props.saveFunction;
    this._getUserDocumentsFunction = this._props.getUserDocuments;
    this._openSandBoxFunction = this._props.openSBFunction,///
    this._saveCopyFunction = this._props.saveCopyFunction;
    this._printFunction = this._props.printFunction;
    this._shareFunction = this._props.shareFunction;
    this._loadFunction = this._props.loadFunction;
    this._fileContentFunction = this._props.fileContentFunction;
    this._updateFileContentFunction = this._props.updateFileContentFunction;
    // this._currentDocument = this._props.currentDocument;
    this._shareFunction = this._props.shareFunction;
    this._createShareLink = this._props.createShareLink;
    this._likeFunction = this._props.likeFunction;
    this._refreshFunction = this._props.refreshFunction;
    this._cellEditingFunction = this._props.cellEditingFunction;
    this._checkModelFunctioin = this._props.checkModelFunction;
    this._viewFactory = this._props.viewFactory;
    this._gridBuilder = this._props.gridBuilder;
    this._autoSaveFunction = this._props.autoSaveFunction;
    this._setPagePropsFunction = this._props.setPagePropsFunction;
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
    this._setUpMenuItemRefresh();
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
      this._menuCalcOutcome.parentElement.parentElement.classList.remove('service-section__submenu-list_is-visible');
      const result = this._calcStock(2);
      this._gridBuilder.setStockGridData(this._outcomeGridObject, result, false);
      this.getDataCheckModelAndRender();
    });

  }

  /**
   * @param {Number} calcMode режим расчета (0 - входящие, 2 - исходящие)
   * @returns перерасчитанные остатки
   */
  _calcStock(calcMode : CalcTypes) {
    const notebookData =
      this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);
    return this._calcFunction.call(this, notebookData, calcMode);
  }

  /**
   * Настройка меню Сохранить
   */
  _setUpMenuItemSave() {
    this._menuSave = this._serviceMenu.querySelector('.menu-item-save');
    this._menuSave.addEventListener('click', () => {

      let preloader = this.getProps().preloader;
      this._componentDOM.appendChild(preloader);

      const data = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);

      this._saveFunction.call(this, data)
      .then((res : any) => {
        preloader.remove();
      })
      .catch((err : any) => {
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

       const data = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);

       this._saveCopyFunction.call(this, data)
       .then((res : any) => {
         preloader.remove();
       })
       .catch((err : any) => {
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
    });
  }

  _openEvent() {
    let preloader = this.getProps().preloader;
    this._componentDOM.appendChild(preloader);

    this._getUserDocumentsFunction.call(this)
    .then((rowData : any) => {
      preloader.remove();
      const comparatorFunc = (sDate1 : string, sDate2 : string) => {
        let date1Number = new Date(sDate1).getTime();
        let date2Number = new Date(sDate2).getTime();

        if (date1Number === null && date2Number === null) {
          return 0;
        }
        if (date1Number === null) {
          return -1;
        }
        if (date2Number === null) {
          return 1;
        }
        if (date1Number === date2Number) {
          return 0;
        }
        return date1Number - date2Number;
      }

      const columnDefs = [

        { headerName: `${Properties.lang.dict.notebook.name}`, field: 'shortdesc', resizable: true, editable: false, sortable: true, filter: 'agTextColumnFilter', /*tooltipValueGetter: this.getServiceBuilder().toolTipValueGetter*/ },
        { headerName: `${Properties.lang.dict.notebook.id}`, field: 'id', resizable: true, editable: false, sortable: true, filter: 'agTextColumnFilter', /*tooltipValueGetter: this.getServiceBuilder().toolTipValueGetter*/ },
        { headerName: `${Properties.lang.dict.notebook.refresh}`, field: 'date', resizable: true, editable: false, sortable: true, filter: 'agTextColumnFilter', comparator: comparatorFunc},
        { headerName: `${Properties.lang.dict.notebook.share}`, field: 'share', resizable: true, editable: false, sortable: true, filter: 'agTextColumnFilter',},

      ];

      const gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        rowSelection: 'single',
      };

      const options = {
        className: 'grid',
        height: '50vh',
        maxWidth: '100%',
      }

      const gridFactory = new GridFactory();
      const gridElement = gridFactory.createGridElement(options);
      const gridObj = gridFactory.createGridObject(gridElement, gridOptions);
      gridObj.sizeColumnsToFit();
      gridObj.applyColumnState({
        state: [{ colId: 'date', sort: 'desc' }],
        defaultState: { sort: null },
      });
      const form = new FormsFactory().createSingleGridForm('selectForm', gridElement);
      const popup = new SelectFromGridPopUp({
        title: `${Properties.lang.dict.popups.selectNotebookTitle}`,
        form: form,
        submitFunction: this._openSandBoxFunction,
        gridObj: gridObj,
        popupWidth: "85vw",
      });
      popup.open();
    })
    .catch((err : any) => {
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
      this.createNotebookPropertiesDialog();
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
      .then((res : any) => {
        preloader.remove();
      })
      .catch((err : any) => {
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
      Dialog.CopyValueDialog(`${Properties.lang.dict.promts.notebookLink}`, this._createShareLink.call(this));
    })
  }

  /**
   * Насторойка меню Свойства
   */
  _setUpMenuItemProperties() {
    this._menuProperties = this._serviceMenu.querySelector('.menu-item-properties');
    this._menuProperties.addEventListener('click', () => {
      this.createNotebookPropertiesDialog();
    });
  }

  // диалог редактирования свойств тетради
  createNotebookPropertiesDialog() {
    let docProps = this._fileContentFunction.call(this);
    const shortdesc = 'shortdesc';
    const desc = 'desc';
    const tags = 'tags';

    const inputForm = new FormsFactory().createPropertiesForm('input-form', shortdesc, desc, tags);

    const shortDescEl = inputForm.querySelector(`.${shortdesc}`) as HTMLInputElement;
    const descEl = inputForm.querySelector(`.${desc}`) as HTMLInputElement;
    const tagsEl = inputForm.querySelector(`.${tags}`) as HTMLInputElement;;

    shortDescEl.value = docProps.properties.shortdesc;
    descEl.value = docProps.properties.description;
    tagsEl.value = docProps.properties.tags;

    const popup = new InputMultiValuesPopUp ({
      form: inputForm,
      inputs: [shortDescEl, descEl, tagsEl],
      submitFunction: this._updateFileContentFunction,
      title: `${Properties.lang.dict.popups.notebookPropTitle}`,
    });
    const validator = new FormInputsValidator(popup.getForm(), Properties.lang.dict.errors);
    popup.open();
  }

  /**
   * Настройка рейтинга
   */
  _setUpLikeComponent() {
    this._fileLikeComponent.addEventListener('click', () => {

      let preloader = this.getProps().preloader;
      this._componentDOM.appendChild(preloader);

      this._likeFunction.call(this)
      .then((res : any) => {
        preloader.remove();
        this.setLikesCount(res.count);
      })
      .catch((err : any) => {
        preloader.remove();
        this.handleError(err);
      });

    });
  }

  //обновление документа
  _setUpMenuItemRefresh() {
    this._menuRefresh = this._serviceMenu.querySelector('.menu-item-refresh');
    this._menuRefresh.addEventListener('click', () => {
      return this._refreshFunction.call(this);
    })
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
        this._incomeGridObject.sizeColumnsToFit();
        this._flowsGridObject.sizeColumnsToFit();
        this._outcomeGridObject.sizeColumnsToFit();
      });
    }
  }

  /**
   * Устанавливает обработчик на редактирование ячейки грида
   * @param {Grid} gridObject
   */
  _setUpCellEditingFunction(gridObject : GridApi) {
    gridObject.addEventListener('cellEditingStopped', () => {
      const gridDataObj = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);
      this._cellEditingFunction.call(this, gridDataObj);
      this.checkModelAndRender(gridDataObj);
    });
  }

/**
 * Автосохранение документа
 */
  autoSaveDocument = () => {
    let preloader = this.getProps().preloader;
    this._componentDOM.appendChild(preloader);

    const gridData = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);

    if (this._saveFunction instanceof Function) {
      this._saveFunction.call(this, gridData)
      .then((res : any) => {
        preloader.remove();
      })
      .catch((err : any) => {
        preloader.remove();
      });
    }
  }

  /**
   * Обоработчик переключения с текущего представления
   */
  onLeave = () => {
    // const gridData
    //   = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);
    return this._autoSaveFunction.call(this);
  }

  loadData(doc : any) {
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
    const gridDataObj = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);
    this.checkModelAndRender(gridDataObj);

    this._setPagePropsFunction.call(this, {title: doc.properties.shortdesc, description: doc.properties.description});
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
    const gridDataObj = this._gridBuilder.getData(this._incomeGridObject, this._flowsGridObject, this._outcomeGridObject);
    this.checkModelAndRender(gridDataObj);
  }

  checkModelAndRender = (gridDataObj : NotebookGridObject) => {
    let checkResult = this._checkModel(gridDataObj);
    this._renderCheckList(checkResult);
  }

  /**
   * проверяет данные модели
   */
  _checkModel = (gridDataObj : NotebookGridObject) => {
    return this._checkModelFunctioin.call(this, gridDataObj);
  }

  /**
   * Визуализирует результаты проверки
   * @param {Object} checkResult объект результатов проверки
   */
  _renderCheckList = (checkResult : { incomeBalanced : number, outcomeBalanced : number }) => {
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
  handleError(err : Response) {
    if (err.status == 401) {
      this.getProps().loginFunction.call(this);
    }
    else {
      //Dialog.ErrorDialog(`${Properties.lang.dict.errors.error}: ${err.statusText}`);
      Dialog.ErrorDialog(`${Properties.lang.dict.errors.error}: ${err}`);
    }
  }

  getShareStatus() {
    return this._fileShareComponent.textContent ? true : false;
  }

  setShareStatus(status : boolean) {
    status ? this._fileShareComponent.classList.remove('service-section__menu-item_not-visible') : this._fileShareComponent.classList.add('service-section__menu-item_not-visible');
    status ? this._menuShare.lastChild.nodeValue = `${Properties.lang.dict.sandbox.menu.unshare}` : this._menuShare.lastChild.nodeValue = `${Properties.lang.dict.sandbox.menu.share}`;
  }

  setLikesCount(count : number) {
    this._fileLikesCountComponent.textContent = count.toString();
  }

  getLikesCount() {
    return this._fileLikesCountComponent.textContent;
  }

}