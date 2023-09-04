import AccountingEntriesSet from "../../../common/accounting/AccountingEntriesSet";
import AccountingEntry from "../../../common/accounting/AccountingEntry";
import AccountsSet from "../../../common/accounting/AccountsSet";
import Account from "../../../common/accounting/Account";
import ServiceProvider from "../ServiceProvider";
import SelectFromGridPopUp from "../../popups/SelectFromGridPopUp";
import FormsFactory from "../../../common/factories/FormsFactory";
import GridFactory from "../../../common/factories/GridFactory";
import FormInputsValidator from "../../../validators/FormInputsValidator";
import Properties from "../../../properties/Properties";
import Dialog from "../../../common/dialogs/Dialog";
import InputMultiValuesPopUp from "../../../static/popups/InputMultiValuesPopUp";
import PrintFactory from "../../../common/factories/PrintFactory";

/**
 * Провайдер сервиса Песочницы
 */
 export default class SandBoxProvider extends ServiceProvider {

  constructor(props) {
    super(props);
  }

  /**
   * Функция пересчета документа в Песочнице
   */
  calcSandBox = (income, flows, outcome, calcMode) => {
    return this._calcSandBox(income, flows, outcome, calcMode)
  }

  _calcSandBox(income, flows, outcome, calcMode) {
    //собираем баланс и обороты
    const incomeSet = this.transformStocks(income);
    const flowsSet = this.transformFlows(flows);
    const outcomeSet = this.transformStocks(outcome);

    return this.calcStocksAndFlows(incomeSet, flowsSet, outcomeSet, calcMode);
  }

  /**
   * Функция сохранения документа из Песочницы
   */
  saveSandBox = (income, flows, outcome) => {
    return this._saveSandBox(income, flows, outcome)
  }

  _saveSandBox(income, flows, outcome) {

    //собираем баланс и обороты
    const incomeSet = this.transformStocks(income);
    const flowsSet = this.transformFlows(flows);
    const outcomeSet = this.transformStocks(outcome);

    let sbdoc = this.createDocument(incomeSet, flowsSet, outcomeSet, this.getCurrentDocument().share, this.getCurrentDocument().properties);
    //смотрим есть ли ID
    const _id = this.getCurrentDocument()._id;

    if (_id) {//документ существует
      sbdoc._id = _id;
      return this.getApi().updateSandBoxDocument(sbdoc)
      .then((res) => {
        if (res.data.ok) {
          //загружаем обновленный
          return this._openSandBox(_id);
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    }
    else {//новый документ
      return this.getApi().saveSandBoxDocument(sbdoc)
      .then((res) => {
        this.setCurrentDocument(res.data);
        this.loadCurrentDocument();
        return res;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    }

  }

  /**
   * Функция сохранения документа из Песочницы
   */
  saveSandBoxCopy = (income, flows, outcome) => {
    return this._saveSandBoxCopy(income, flows, outcome);
  }

  _saveSandBoxCopy(income, flows, outcome) {

    this.getCurrentDocument()._id = null;
    this.getCurrentDocument().properties.shortdesc = this.getCurrentDocument().properties.shortdesc + ' (копия)';
    this.getCurrentDocument().share = false;
    return this.saveSandBox(income, flows, outcome);

  }

  /**
   * Функция печати документа из Песочницы
   */
   printSandBox = () => {
    return this._printSandBox();
  }

  _printSandBox() {

    let doc = this.getCurrentDocument();
    let openWindow = window.open("", "title", "attributes");
    // openWindow.document.write(docContainer.innerHTML);
    openWindow.document.write(new PrintFactory().printSbDocToHTML(doc));
    openWindow.document.close();
    openWindow.focus();
    openWindow.print();
    openWindow.close();

  }

  /**
   * Возвращает ИД выбранного документа или Null
   * @returns id документа
   */
  openSandBoxDialog = () => {
    return this._openSandBoxDialog();
  }

  _openSandBoxDialog() {

    return this.getApi().getUserSandBoxDocuments(localStorage.getItem('userId'))
      .then((res) => {

        const rowData = [];
        res.forEach((item) => {
          rowData.push({
            id: item._id,
            shortdesc: item.properties.shortdesc,
            //share: item.share,
            date: new Date(item.lastupdate).toLocaleString(),
          });
        });

        const columnDefs = [

          { headerName: 'Тетрадь', field: 'shortdesc', resizable: true, editable: false, sortable: true, filter: 'agTextColumnFilter' },
          { headerName: 'Имя тетради', field: 'id', resizable: true, editable: false, sortable: true, filter: 'agTextColumnFilter' },
          { headerName: 'Обновлено', field: 'date', resizable: true, editable: false, sortable: true, filter: 'agTextColumnFilter'},

        ];

        const gridOptions = {
          columnDefs: columnDefs,
          rowData: rowData,
          rowSelection: 'single',
        };

        const options = {
          height: '270px',
          maxWidth: '100%',
        }

        const gridFactory = new GridFactory();
        const gridElement = gridFactory.createGridElement(options);
        const gridObj = gridFactory.createGridObject(gridElement, gridOptions);
        const form = new FormsFactory().createSingleGridForm('selectForm', gridElement);
        const popup = new SelectFromGridPopUp({
          title: 'Выбор тетради',
          form: form,
          submitFunction: this.openSandBox,
          gridObj: gridObj,
          popupWidth: "40%",
        });
        popup.open();
      })
      .catch((err) => {
        return Promise.reject(err);
      });

  }

  /**
   * Функция загрузки документа по ИД и пользователю
   */
  openSandBox = (docsArr) => {
    if (docsArr.length) {
      let docId = docsArr[0].id;
      if (docId) {
        return this._openSandBox(docId);
      }
    }
    else {
      return Promise.reject(new Error('Не выбран документ!'));
    }

  }

  _openSandBox(docId) {

    return this.getApi().getSandBoxDocument(docId)
    .then((res) => {
      this.setCurrentDocument(res[0]);
      this.loadCurrentDocument();
      return res;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  }

  // загрузка расшаренного документа по docId
  _openShareSandBox(docId, isViewed) {
    return this.getApi().getShareSandBoxDocument(docId, isViewed)
    .then((res) => {
      if (res[0]) {
        this.setCurrentDocument(res[0]);
        this.loadCurrentDocument();
      }
      else {
        Dialog.ErrorDialog(`Документ не найден или владелец прекратил его публикацию!`);
        this.newSandBox();
      }
      return res;
    })
    .catch((err) => {
      this.newSandBox();//при ошибке запроса - новый документ
      return Promise.reject(err);
    });
  }

  /**
   * Создание пустого документа и загрузка его в представление
   */
  newSandBox = () => {
    this._newSandBox();
  }

  _newSandBox() {
    this.setCurrentDocument({
      _id: null,
      text: {
        income: {},
        flows: {},
        outcome: {},
      },
      lastupdate: new Date().getTime(),
      share: false,
      properties: {
        shortdesc: 'Моя тетрадь',
        description: 'Набор проводок по операции',
        tags: '#МойТэг',
      },
      likes: [],
      views: 0,
    });
    this.loadCurrentDocument();
  }

  /**
   * Функция открытия диалога обновления описания тетради
   */
  openUpdateFileContentDialog = () => {
    this._openUpdateFileContentDialog();
  }

  _openUpdateFileContentDialog() {

    const shortdesc = 'shortdesc';
    const desc = 'desc';
    const tags = 'tags';

    const inputForm = new FormsFactory().createPropertiesForm('input-form', shortdesc, desc, tags);

    const shortDescEl = inputForm.querySelector(`.${shortdesc}`);
    const descEl = inputForm.querySelector(`.${desc}`);
    const tagsEl = inputForm.querySelector(`.${tags}`);

    shortDescEl.value = this.getCurrentDocument().properties.shortdesc;
    descEl.value = this.getCurrentDocument().properties.description;
    tagsEl.value = this.getCurrentDocument().properties.tags;

    const popup = new InputMultiValuesPopUp({
      form: inputForm,
      inputs: [shortDescEl, descEl, tagsEl],
      submitFunction: this.updateFileContent,
      title: 'Свойства тетради',
    });
    const validator = new FormInputsValidator(popup.getForm(), Properties.popupErrMsg);
    popup.open();
  }

  /**
   * Функция обновления описания тетради
   */
  updateFileContent = (newContent) => {
    return this._updateFileContent(newContent);
  }

  _updateFileContent(newContent) {
    const newProperties = {
      shortdesc: newContent[0],
      description: newContent[1],
      tags: newContent[2],
    };

    if (!this.getCurrentDocument()._id) {//если документ новый и не сохраненный, просто меняем параметры
      this.getCurrentDocument().properties = newProperties;
      this.loadCurrentDocument();
      return Promise.resolve("done");
    }
    else {
      const sbdoc = this.getCurrentDocument();
      const oldProperties = sbdoc.properties;
      sbdoc.properties = newProperties;
      return this.getApi().updateSandBoxDocument(sbdoc)
      .then((res) => {
        if (res.data.ok) {
          //загружаем обновленный
          return this._openSandBox(sbdoc._id);
        }
      })
      .catch((err) => {
        this.getCurrentDocument().properties = oldProperties;
        return Promise.reject(err);
      });
    }
  }

  /**
   * Функция генерирования ссылки на документ
   */
  createShareLink = () => {
    return this._createShareLink();
  }

  _createShareLink() {
    const docId = this.getCurrentDocument()._id;
    if (docId) {
      const sbdoc = this.getCurrentDocument();
      const oldShare = sbdoc.share
      sbdoc.share = ! oldShare;//инвертируем расшаривание
      return this.getApi().updateSandBoxDocument(sbdoc)
      .then((res) => {
        if (res.data.ok) {
          //показываем ссылку на документ, если расшаривали его
          if (!oldShare) {
            this.createAndShowShareLink();
          }
          //загружаем обновленный
          return this._openSandBox(sbdoc._id);
        }
      })
      .catch((err) => {
        this.getCurrentDocument().share = oldShare;
        return Promise.reject(err);
      });
    }
    else {
      return Promise.reject(new Error('Необходимо сначало сохранить тетрадку'));
    }
  }

  //создает и показывает ссылку на расшаренный документ
  createAndShowShareLink = () => {
    Dialog.CopyValueDialog('Ссылка на тетрадку:', `${Properties.site.host}/?id=${this.getCurrentDocument()._id}`);
  }

  //рейтинг документа
  like = () => {
    return this._like();
  }

  _like() {
    const docId = this.getCurrentDocument()._id;
    //документ новый и не сохранялся
    if (!docId) {
      return Promise.reject(new Error('Необходимо сначало сохранить тетрадку!'));
    }
    return this.getApi().likeDoc(docId)
    .then((res) => {
      this.getCurrentDocument().likes = res.count;
      return res;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  }

  /**
   * Синхранизация модели и представления
   */
  synchronizeModel = (incomeArr, outcomeArr, flowsArr) => {
    const income = this.transformStocks(incomeArr);
    const outcome = this.transformStocks(outcomeArr);
    const flows = this.transformFlows(flowsArr);
    let sbdoc = this.createDocument(income, flows, outcome,
      this.getCurrentDocument().share, this.getCurrentDocument().properties);
    sbdoc._id = this.getCurrentDocument()._id;

    this.setCurrentDocument(sbdoc);
  }

  /**
   * Проверка данных представления
   */
  checkModel = (incomeArr, outcomeArr, flowsArr) => {

    const income = this.transformStocks(incomeArr);
    const outcome = this.transformStocks(outcomeArr);
    const flows = this.transformFlows(flowsArr);

    return {
      incomeBalanced: income.wellBalanced(0),
      outcomeBalanced: outcome.wellBalanced(1),
    }

  }


  /**
   * Метод расчета остатков и оборотов
   * @param {AccountsSet} incomeAccSet входящие остатки
   * @param {AccountingEntriesSet} entriesSet обороты
   * @param {AccountsSet} outcomeAccSet исходящие остатки
   * @param {Number} calcMode режим расчета (0 - входящие, 1 - ни чего не считаем, 2 - исходящие)
   */
   calcStocksAndFlows = (incomeAccSet, entriesSet, outcomeAccSet, calcMode) => {
    return this._calcStocksAndFlows(incomeAccSet, entriesSet, outcomeAccSet, calcMode);
  }

   _calcStocksAndFlows(incomeAccSet, entriesSet, outcomeAccSet, calcMode) {

    //смотрим, что надо вычислять
    if (calcMode == 0) {
      outcomeAccSet.calcStocks(entriesSet, true);
      return outcomeAccSet.toJSON();
    }
    if (calcMode == 1) {
      return '0';
    }
    if (calcMode == 2) {
      incomeAccSet.calcStocks(entriesSet, false);
      return incomeAccSet.toJSON();
    }
  }

  /**
   * Метод формирования набора счетов из массива объектов-строк
   * @param {Array} stockArr остатки
   */
  transformStocks = (stockArr) => {
    return this._transformStocks(stockArr);
  }

  _transformStocks(stockArr) {

    //собираем остатки
    const accSet = new AccountsSet();

      stockArr.forEach(accObj => {

      if (accObj.accountNumber != null) {
        const acc = new Account();
        acc.setAccNumber(accObj.accountNumber);
        acc.setOpenBalance({
          debet: Number(accObj.debet == null ? 0 : accObj.debet),
          credit: Number(accObj.credit == null ? 0 : accObj.credit),
        });
        acc.setCloseBalance({
          debet: Number(accObj.debet == null ? 0 : accObj.debet),
          credit: Number(accObj.credit == null ? 0 : accObj.credit),
        });
        acc.setDescription(accObj.note);
        accSet.add(acc);
      }

    })

    return accSet;
  }

  /**
   * Метод формирования оборотов из массива объектов-строк
   * @param {Array} flowsArr обороты
   */
  transformFlows = (flowsArr) => {
    return this._transformFlows(flowsArr);
  }

  _transformFlows(flowsArr) {

    //собираем обороты
    const flowsSet = new AccountingEntriesSet();
    flowsArr.forEach(entryObj => {

      //не берем пустые счета
      if ((entryObj.debet != null) && (entryObj.credit != null)) {
        const entry = new AccountingEntry();
        entry.setName(entryObj.operationDesc);

        const accDebet = new Account();
        accDebet.setAccNumber(entryObj.debet)
        entry.setAccDebet(accDebet);

        const accCredit = new Account();
        accCredit.setAccNumber(entryObj.credit);
        entry.setAccCredit(accCredit);

        entry.setDescription(entryObj.note);
        entry.setSum(entryObj.summ == null ? 0 : entryObj.summ);

        flowsSet.add(entry);
      }

    })

    return flowsSet;
  }

  /**
   * Получение текущей версии документа
   * @param {AccountsSet} incomeSet входящие остатки
   * @param {AccountingEntriesSet} flowsSet оборооты
   * @param {AccountsSet} outcomeSet исходящие остатки
   * @param {Boolean} share признак доступности тетради
   * @param {String} properties свойства тетради
   * @returns {Object} документ
   */
  createDocument(incomeSet, flowsSet, outcomeSet, share, properties) {

    return  {
      text: {
        income: incomeSet.toJSON(),
        flows: flowsSet.toJSON(),
        outcome: outcomeSet.toJSON(),
      },
      lastupdate: new Date().getTime(),
      share: share,
      properties: properties,
      likes: [],
      views: 0,
    }
  }

  /**
   * Загружает текущий документ в представление
   */
  loadCurrentDocument() {
    if (this.getCurrentDocument()) {
      this.getServiceBuilder().loadData(this.getCurrentDocument());

      const incomeArr = this.getServiceBuilder().getStockGridData(this.getServiceBuilder()._openingGridObject);
      const outcomeArr = this.getServiceBuilder().getStockGridData(this.getServiceBuilder()._closeingGridObject);
      const flowsArr = this.getServiceBuilder().getFlowGridData(this.getServiceBuilder()._flowGridObject);
      this.getServiceBuilder().checkModelAndRender(incomeArr, outcomeArr, flowsArr);

    }
  }

}