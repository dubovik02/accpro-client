import AccEntity from "../AccEntity";
import AccountingEntry from "./AccountingEntry";

/**
 * Класс набора бухгалтерских операций
 */

export default class AccountingEntriesSet extends AccEntity {

  /**
   * Набор бухглатерских записей
   */
  _entriesSet = [];

  constructor() {
    super();
  }

  getEntriesSet() {
    return this._entriesSet;
  }
  setEntriesSet(value) {
    this._entriesSet = value;
  }

  /**
   * Добавляет проводку к набору
   * @param {AccountingEntry} accountingEntry - запись
   */
  add(accountingEntry) {
    this._entriesSet.push(accountingEntry);
  }

}
