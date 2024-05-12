import AccEntity from "../AccEntity";
import Account from "./Account";
import AccountingEntriesSet from "./AccountingEntriesSet";

/**
 * Класс набора счетов
 */
export default class AccountsSet extends AccEntity {

  /**
   * Набор счетов
   */
  _accountsSet = [];


  constructor() {
    super();
  }

  getAccountsSet() {
    return this._accountsSet;
  }
  setAccountsSet(value) {
    this._accountsSet = value;
  }

  /**
   * Добавление счета в набор
   * @param {Account} account счет для добавления
   */
  add(account) {

    //если счет есть - объединяем их
    let setsAcc = this.isNumberExist(account.getAccNumber());
    if (setsAcc) {
      setsAcc.concat(account);
    }
    else {
      this._accountsSet.push(account);
    }
    // this._accountsSet.push(account);
  }

  /**
   * Возвращает счет из набора по его номеру
   * @param {String} accNumber номер счета
   * @returns есть счет в наборе - счет, нет счета в наборе - null
   */
  isNumberExist(accNumber) {

    let result = null;

    this._accountsSet.forEach(acc => {

      if (acc.getAccNumber() == accNumber) {
        result = acc;
      }
    })

    return result;
  }

  /**
   * Преобразует объект класса в формат JSON
   * @returns JSON-объект
   */
  toJSON() {

    let result = super.toJSON();
    let accSet = []
    this.getAccountsSet().forEach(acc => {
      accSet.push(acc.toJSON());
    })

    result.accounts = accSet;
    return result;

  }

  /**
   * Фрормирует объект из JSON-объекта
   * @param {Object} obj
  */
  parseJSON(obj) {

    super.parseJSON(obj);
    obj.accounts.forEach(acc => {
      let accObj = new Account();
      accObj.parseJSON();
      this.add(accObj);
    })

  }

  /**
   * Рассчитывает остаток путем изменения на величину
   * оборотов по набору проводок.
   * @param {AccountingEntriesSet} entriesSet набор проводок
   * @param {Boolean} isIncomeStocksCalc true - рассчитать входящий, false - рассчитать исходящий
   */
  calcStocks(entriesSet, isIncomeStocksCalc) {

    //добавляем все счета которые есть в оборотах и отсутствующие в остатках
    entriesSet.getEntriesSet().forEach(entry => {

      let debtAcc = entry.getAccDebet();
      let creditAcc = entry.getAccCredit();

      if (this.isNumberExist(debtAcc.getAccNumber()) == null) {
        let newDebt = new Account();
        newDebt.setAccNumber(debtAcc.getAccNumber())
        this.add(newDebt);
      }
      if (this.isNumberExist(creditAcc.getAccNumber()) == null) {
        let newCred = new Account();
        newCred.setAccNumber(creditAcc.getAccNumber())
        this.add(newCred);
      }
    })
    //сворачиваем счета
    this._accountsSet.forEach(stockAcc => {

      entriesSet.getEntriesSet().forEach(entry => {
        let debtAcc = entry.getAccDebet();
        let creditAcc = entry.getAccCredit();
        if (stockAcc.getAccNumber() == debtAcc.getAccNumber()) {
          stockAcc.addDebetFlow(debtAcc.getId(), debtAcc.calcDebetFlows());
          isIncomeStocksCalc ? stockAcc.calcOpenBalance() : stockAcc.calcCloseBalance();
        }
        if (stockAcc.getAccNumber() == creditAcc.getAccNumber()) {
          stockAcc.addCreditFlow(creditAcc.getId(), creditAcc.calcCreditFlows());
          isIncomeStocksCalc ? stockAcc.calcOpenBalance() : stockAcc.calcCloseBalance();
        }
      })

    })

  }


  /**
   * проверяет равенство дебета и кредита в наборе (баланс набора) и возвращает
   * абсолютную разность между дебетом и кредитом
   * @param {Number} stockType 0 проверяет входящие остатки, 1 проверяет исходящие остатки
   */
   wellBalanced(stocksType) {

    let sDeb = 0;
    let sCred = 0;

    if (!stocksType) {
      this._accountsSet.forEach((item) => {
        sDeb = sDeb + item.getOpenBalance().debet;
        sCred = sCred + item.getOpenBalance().credit;
      });
    }
    else {
      this._accountsSet.forEach((item) => {
        sDeb = sDeb + item.getCloseBalance().debet;
        sCred = sCred + item.getCloseBalance().credit;
      });
    }

    return Math.abs(sDeb - sCred);
  }

}