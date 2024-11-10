import AccEntity from "../AccEntity";
import AccountingEntry from "./AccountingEntry";
import { AccountingEntriesSetObject, AccountingEntryObject } from "./AccObjects";

/**
 * Класс набора бухгалтерских операций
 */

export default class AccountingEntriesSet extends AccEntity {

  /**
   * Набор бухгалтерских записей
   */
  _entriesSet : Array<AccountingEntry> = [];

  constructor() {
    super();
  }

  getEntriesSet() {
    return this._entriesSet;
  }

  setEntriesSet(value : Array<AccountingEntry>) {
    this._entriesSet = value;
  }

  /**
   * Добавляет проводку к набору
   * @param {AccountingEntry} accountingEntry - запись
   */
  add(accountingEntry : AccountingEntry) {
    this._entriesSet.push(accountingEntry);
  }

  /**
   * Преобразует объект класса в формат JSON
   * @returns JSON-объект
   */
  toJSON() {
    let result : {[key: string]: any} = super.toJSON();

    let entries : Array<Object> = [];
    this.getEntriesSet().forEach( (entry : AccountingEntry) => {
      entries.push(entry.toJSON());
    })

    result.entries = entries;
    return result;
  }

  /**
   * Фрормирует объект из JSON-объекта
   * @param {Object} obj
  */
  parseJSON(obj : AccountingEntriesSetObject) {

    super.parseJSON(obj);

    this.clearEntriesData();

    obj.entries.forEach( (entry : AccountingEntryObject) => {
      let accEntry = new AccountingEntry();
      accEntry.parseJSON(entry);
      this.add(accEntry);
    })

  }

  /**
   * Проверяет равенство дебета и кредита в наборе и возвращает
   * абсолютную разность между дебетом и кредитом.
   */
  wellBalanced() : number {

    let sDeb = 0;
    let sCred = 0;

    this._entriesSet.forEach((item) => {
      sDeb =+ item.getSum();
      sCred =+ item.getSum();
    });

    return Math.abs(sDeb - sCred);
  }

  /**
   * Очищает набор проводок
   */
  clearEntriesData() : void {
    this._entriesSet = [];
  }

}
