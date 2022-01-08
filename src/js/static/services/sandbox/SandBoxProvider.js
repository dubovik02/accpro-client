import AccountingEntriesSet from "../../../common/accounting/AccountingEntriesSet";
import AccountingEntry from "../../../common/accounting/AccountingEntry";
import AccountsSet from "../../../common/accounting/AccountsSet";
import Account from "../../../common/accounting/Account";
import ServiceProvider from "../ServiceProvider";
import SelectFromGridPopUp from "../../popups/SelectFromGridPopUp";
import FormsFactory from "../../../common/factories/FormsFactory";
import GridFactory from "../../../common/factories/GridFactory";
import AccMessageDialog from "../../../common/dialogs/AccMessageDialog";
import InputValuePopUp from "../../../static/popups/InputValuePopUp";
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

  saveSandBox = (income, flows, outcome, description) => {
    return this._saveSandBox(income, flows, outcome, description)
  }

  _saveSandBox(income, flows, outcome, description) {

    //собираем баланс и обороты
    const incomeSet = this.transformStocks(income);
    const flowsSet = this.transformFlows(flows);
    const outcomeSet = this.transformStocks(outcome);

    let sbdoc = this.createDocument(incomeSet, flowsSet, outcomeSet, description);

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
   * Возвращает ИД выбранного документа или Null
   * @returns id документа
   */
  openSandBoxDialog = () => {
    return this._openSandBoxDialog();
  }

  _openSandBoxDialog() {

    this.getApi().getUserSandBoxDocuments(localStorage.getItem('userId'))
      .then((res) => {

        const rowData = [];
        res.forEach((item) => {
          rowData.push({
            id: item._id,
            description: item.description,
            date: new Date(item.lastupdate).toLocaleString(),
          });
        });

        const columnDefs = [

          { headerName: 'Тетрадь', field: 'description', resizable: true, editable: false, sortable: true, filter: 'agTextColumnFilter' },
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
        });
        popup.open();
      })
      .catch((err) => {
        //если не авторизированы - авторизируем
        if (err.status == 401) {
          this.getServiceBuilder().getProps().loginFunction.call(this);
        }
        else {
          const popup = new AccMessageDialog(`Ошибка: ${err.statusText} (Код: ${err.status})`);
          popup.open();
        };
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
      return Promise.reject(new Error('Не выбран документ'));
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

  /**
   * Создание пустого документа и загрузка его в представление
   */
  newSandBox = () => {
    this._newSandBox();
  }

  _newSandBox() {
    this.setCurrentDocument({
      _id: null,
      description: "Моя тетрадь",
      text: {
        income: {},
        flows: {},
        outcome: {},
      },
      lastupdate: new Date().getTime(),
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
    const inputForm = new FormsFactory().createInputTextForm('input-form', 'Описание', 'text', 'input-field');
    const inputField = inputForm.querySelector('.popup__input');
    inputField.value = this.getCurrentDocument().description;
    const popup = new InputValuePopUp({
      form: inputForm,
      input: inputField,
      submitFunction: this.updateFileContent,
      title: 'Свойства тетради',
    });
    popup.open();
  }

  /**
   * Функция обновления описания тетради
   */
  updateFileContent = (newContent) => {
    return this._updateFileContent(newContent);
  }

  _updateFileContent(newContent) {
    const sbdoc = this.getCurrentDocument();
    sbdoc.description = newContent;
    if (!sbdoc._id) {//если документ новый и не сохраненный, просто меняем название
      this.getCurrentDocument().description = newContent;
      this.loadCurrentDocument();
      return Promise.resolve("done");
    }
    else {
      return this.getApi().updateSandBoxDocument(sbdoc)
      .then((res) => {
        if (res.data.ok) {
          //загружаем обновленный
          return this._openSandBox(sbdoc._id);
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    }

  }

  /**
   * Метод расчета остатков и оборотов
   * @param {AccountsSet} incomeAccSet входящие остатки
   * @param {AccountingEntriesSet} entriesSet обороты
   * @param {AccountsSet} outcomeAccSet исходящие остатки
   * @param {Number} calcMode режим расчета (0 - входящие, 1 - обороты, 2 - исходящие)
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
          debet: accObj.debet == null ? 0 : accObj.debet,
          credit: accObj.credit == null ? 0 : accObj.credit,
        });
        acc.setCloseBalance({
          debet: accObj.debet == null ? 0 : accObj.debet,
          credit: accObj.credit == null ? 0 : accObj.credit,
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
   * @param {String} description описание тетради
   * @returns {Object} документ
   */
  createDocument(incomeSet, flowsSet, outcomeSet, description) {

    return {
      description: description,
      text: {
        income: incomeSet.toJSON(),
        flows: flowsSet.toJSON(),
        outcome: outcomeSet.toJSON(),
      },
      lastupdate: new Date().getTime(),
    }

  }

  /**
   * Загружает текущий документ в представление
   */
  loadCurrentDocument() {
    if (this.getCurrentDocument()) {
      this.getServiceBuilder().loadData(this.getCurrentDocument());
    }
  }

}