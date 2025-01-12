import AccountingEntriesSet from "../../../common/accounting/AccountingEntriesSet";
import AccountingEntry from "../../../common/accounting/AccountingEntry";
import AccountsSet from "../../../common/accounting/AccountsSet";
import Account from "../../../common/accounting/Account";
import ServiceProvider from "../ServiceProvider";
import Properties from "../../../properties/Properties";
import PrintFactory from "../../../common/factories/PrintFactory";
import SandBoxDocument from "../../../common/documents/SandBoxDocument";
import { FlowGridObject, NotebookGridObject, NotebookPropertiesObject, StockGridObject } from "./SandBoxGridObjects";
import { CalcTypes } from "./SandBoxEnum";
import { SandBoxDocumentObject } from "../../../common/documents/DocumentsObjects";

const lodash = require('lodash');

/**
 * Провайдер сервиса Песочницы
 */
 export default class SandBoxProvider extends ServiceProvider {

  /**
   * Базовый загруженный документ
   */
  _originDocument : SandBoxDocument;

  constructor(props : { [key: string]: any }) {
    super(props);
    this.setCurrentDocument(new SandBoxDocument().getDocumentAsJSON());
  }

  /**
   * Функция пересчета документа в Песочнице
   */
  calcSandBox = (notebookData : NotebookGridObject, calcMode : CalcTypes) => {
    return this._calcSandBox(notebookData, calcMode)
  }

  _calcSandBox(notebookData : NotebookGridObject, calcMode : CalcTypes) {

    //собираем баланс и обороты
    const incomeSet = this.transformStocks(notebookData.income);
    const flowsSet = this.transformFlows(notebookData.flows);
    const outcomeSet = this.transformStocks(notebookData.outcome);

    let result = this.calcStocksAndFlows(incomeSet, flowsSet, outcomeSet, calcMode);
    this.getCurrentDocument().text = {
      income: calcMode == CalcTypes.INCOME ? result : incomeSet.toJSON(),
      flows: flowsSet.toJSON(),
      outcome: calcMode == CalcTypes.OUTCOME ? result : outcomeSet.toJSON(),
    };

    return result;
  }

  /**
   * Функция сохранения документа из Песочницы
   */
  saveSandBox = (notebookData : NotebookGridObject) => {
    return this._saveSandBox(notebookData)
  }

  _saveSandBox(notebookData : NotebookGridObject) {

    //собираем баланс и обороты
    const incomeSet = this.transformStocks(notebookData.income);
    const flowsSet = this.transformFlows(notebookData.flows);
    const outcomeSet = this.transformStocks(notebookData.outcome);

    this.getCurrentDocument().text = {
      income: incomeSet.toJSON(),
      flows: flowsSet.toJSON(),
      outcome: outcomeSet.toJSON(),
    };

    this.getCurrentDocument().lastupdate = new Date().getTime();
    this.getCurrentDocument().__v = undefined;

    //смотрим есть ли ID
    const _id = this.getCurrentDocument()._id;

    if (_id) {//документ существует
      this.getCurrentDocument()._id = _id;
      return this.getApi().updateSandBoxDocument(this.getCurrentDocument())
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
      return this.getApi().saveSandBoxDocument(this.getCurrentDocument())
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
  saveSandBoxCopy = (notebookData : NotebookGridObject) => {
    return this._saveSandBoxCopy(notebookData);
  }

  _saveSandBoxCopy(notebookData : NotebookGridObject) {

    this.getCurrentDocument()._id = undefined;
    this.getCurrentDocument().owner = undefined;
    this.getCurrentDocument().properties.shortdesc = this.getCurrentDocument().properties.shortdesc
      + ` (${Properties.lang.dict.general.copy})`;
    this.getCurrentDocument().share = false;
    return this.saveSandBox(notebookData);

  }

  /**
   * Функция автосохранения тетрадки
   */
  autoSaveSandBox = () => {
    return this._autoSaveSandBox();
  }

  _autoSaveSandBox() {
    if (this.isDocumentChanged()) {
      return confirm(Properties.lang.dict.dialogs.saveOrNo);
    }
    else {
      return false;
    }
  }

  /**
   * Функция печати документа из Песочницы
   */
   printSandBox = () => {
    return this._printSandBox();
  }

  _printSandBox() {
    let doc = this.getCurrentDocument() as SandBoxDocumentObject;
    let openWindow = window.open("", "title", "attributes");
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
  getUserDocuments = () => {
    return this._getUserDocuments();
  }

  _getUserDocuments() {
    return this.getApi().getUserSandBoxDocuments(localStorage.getItem('userId'))
      .then((res) => {
        const rowData : Array<any> = [];
        res.forEach((item : any) => {
          rowData.push({
            id: item._id,
            shortdesc: item.properties.shortdesc,
            share: item.share ? Properties.lang.dict.notebook.share : Properties.lang.dict.notebook.unshare,
            // date: new Date(item.lastupdate).toLocaleString(),
            date: new Date(item.lastupdate).toISOString(),
          });
        });
        return rowData;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  /**
   * Функция загрузки документа по ИД и пользователю
   */
  openSandBox = (docsArr : Array<any>) => {
    if (docsArr.length) {
      let docId = docsArr[0].id;
      if (docId) {
        return this._openSandBox(docId);
      }
    }
    else {
      return Promise.reject(new Error(`${Properties.lang.dict.errors.notebookNotSelected}!`));
    }
  }

  _openSandBox(docId : string) {

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
  _openShareSandBox(docId : string, isViewed : boolean) {
    return this.getApi().getShareSandBoxDocument(docId, isViewed)
    .then((res) => {
      if (res[0]) {
        this.setCurrentDocument(res[0]);
        this.loadCurrentDocument();
      }
      else {
        this.newSandBox();
        return Promise.reject(`${Properties.lang.dict.errors.notebookNotFound}!`);
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
    let doc = new SandBoxDocument();
    this.setCurrentDocument(doc.getDocumentAsJSON());
    this.loadCurrentDocument();
  }

  /**
   * Функция обновления описания тетради
   */
  updateFileContent = (newContent : Array<string>) => {
    return this._updateFileContent(newContent);
  }

  _updateFileContent(newContent : Array<string>) {
    const newProperties : NotebookPropertiesObject = {
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
            this.getShareLink();
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
      return Promise.reject(new Error(`${Properties.lang.dict.errors.saveNotebook}!`));
    }
  }

  //создает и показывает ссылку на расшаренный документ
  getShareLink = () => {
    return  `https://${Properties.site.host}/?id=${this.getCurrentDocument()._id}`;
  }

  //рейтинг документа
  like = () => {
    return this._like();
  }

  _like() {
    const docId = this.getCurrentDocument()._id;
    //документ новый и не сохранялся
    if (!docId) {
      return Promise.reject(new Error(`${Properties.lang.dict.errors.saveNotebook}!`));
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

  //перезагрузить документ
  refresh = () => {
    return this._refresh();
  }

  _refresh() {
    const docId = this.getCurrentDocument()._id;
    const share = this.getCurrentDocument().share;
    if (docId) {
      if (share) {
        return this._openShareSandBox(docId, true);
      }
      else {
        return this._openSandBox(docId);
      }
    }
    else {
      return Promise.resolve();
    }
  }

  /**
   * Синхранизация модели и представления
   */
  synchronizeModel = (notebookData : NotebookGridObject) => {
    const income = this.transformStocks(notebookData.income);
    const outcome = this.transformStocks(notebookData.outcome);
    const flows = this.transformFlows(notebookData.flows);

    const text = {
      income: income.toJSON(),
      flows: flows.toJSON(),
      outcome: outcome.toJSON(),
    }

    this.getCurrentDocument().text = text;
  }

  /**
   * Проверка данных представления
   */
  checkModel = (notebookData : NotebookGridObject) => {

    const income = this.transformStocks(notebookData.income);
    const outcome = this.transformStocks(notebookData.outcome);
    const flows = this.transformFlows(notebookData.flows);

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
   calcStocksAndFlows = (incomeAccSet : AccountsSet, entriesSet : AccountingEntriesSet, outcomeAccSet : AccountsSet, calcMode : CalcTypes) => {
    return this._calcStocksAndFlows(incomeAccSet, entriesSet, outcomeAccSet, calcMode);
  }

   _calcStocksAndFlows(incomeAccSet : AccountsSet, entriesSet : AccountingEntriesSet, outcomeAccSet : AccountsSet, calcMode : CalcTypes) {

    //смотрим, что надо вычислять
    if (calcMode == CalcTypes.INCOME) {
      outcomeAccSet.calcStocks(entriesSet, true);
      return outcomeAccSet.toJSON();
    }
    if (calcMode == CalcTypes.FLOWS) {
      return '0';
    }
    if (calcMode == CalcTypes.OUTCOME) {
      incomeAccSet.calcStocks(entriesSet, false);
      return incomeAccSet.toJSON();
    }
  }

  /**
   * Метод формирования набора счетов из массива объектов-строк
   * @param {Array<StockGridObject>} stockArr остатки
   */
  transformStocks = (stockArr : Array<StockGridObject>) : AccountsSet => {
    return this._transformStocks(stockArr);
  }

  _transformStocks(stockArr : Array<StockGridObject>) : AccountsSet {

    //собираем остатки
    const accSet = new AccountsSet();

      stockArr.forEach(accObj => {

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

    })

    return accSet;
  }

  /**
   * Метод формирования оборотов из массива объектов-строк
   * @param {Array<FlowGridObject>} flowsArr обороты
   */
  transformFlows = (flowsArr : Array<FlowGridObject>) : AccountingEntriesSet => {
    return this._transformFlows(flowsArr);
  }

  _transformFlows(flowsArr : Array<FlowGridObject>) : AccountingEntriesSet {

    //собираем обороты
    const flowsSet = new AccountingEntriesSet();
    flowsArr.forEach(entryObj => {

      //не берем пустые счета

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
    })

    return flowsSet;
  }

  //возвращает текущий документ (обертка для getCurerentDocument)
  getLoadedDocument = () => {
    return this.getCurrentDocument();
  }

  /**
   * Загружает текущий документ в представление
   */
  loadCurrentDocument() {
    if (this.getCurrentDocument()) {
      this.getServiceBuilder().loadData(this.getCurrentDocument());
      this._originDocument = JSON.parse(JSON.stringify(this.getCurrentDocument()));
    }
  }

  /**
   * Отличается ли документ от базового
   */
  isDocumentChanged() {
    //перепарсиваем из-за потери undefined свойств
    const protoDoc = JSON.parse(JSON.stringify(this.getCurrentDocument()));
    delete protoDoc._id;
    delete protoDoc.owner;

    const originDoc = JSON.parse(JSON.stringify(this._originDocument));
    delete originDoc._id;
    delete originDoc.owner;

    return !(lodash.isEqual(originDoc, protoDoc));
  }

}