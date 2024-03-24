import AccEntity from "../AccEntity";
import AccountingEntry from "./AccountingEntry";

/**
 * Класс набора бухгалтерских операций
 */

export default class AccountingEntriesSet extends AccEntity {

  /**
   * Набор бухгалтерских записей
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

  /**
   * Преобразует объект класса в формат JSON
   * @returns JSON-объект
   */
  toJSON() {
    let result = super.toJSON()

    let entries = []
    this.getEntriesSet().forEach(entrie => {
      entries.push(entrie.toJSON());
    })

    result.entries = entries;
    return result;
  }

  /**
   * Фрормирует объект из JSON-объекта
   * @param {Object} obj
  */
  parseJSON(obj) {

    super.parseJSON(obj);
    obj.entries.forEach(entrie => {
      let entrieObj = new AccountingEntry();
      entrieObj.parseJSON(entrie);
      this.add(entrieObj);
    })

  }

  /**
   * проверяет равенство дебета и кредита в наборе и возвращает
   * абсолютную разность между дебетом и кредитом
   */
  wellBalanced() {

    let sDeb = 0;
    let sCred = 0;

    this._entriesSet.forEach((item) => {
      sDeb =+ item.getSum();
      sCred =+ item.getSum();
    });

    return Math.abs(sDeb - sCred);
  }

}
