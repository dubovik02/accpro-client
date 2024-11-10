import AccEntity from '../AccEntity';
import Account from './Account';
import { AccountingEntryObject } from './AccObjects';

/**
 * Класс бухгалтерской записи
 */

 export default class AccountingEntry extends AccEntity {

  /**
   * Счет по дебету
   */
  _accDebet : Account;

  /**
   * Счет по кредиту
   */
  _accCredit : Account;

  /**
   * Сумма бухгалтерской записи
   */
  _sum : number = 0;

  constructor() {
    super();
  }

  getAccCredit() {
    return this._accCredit;
  }
  setAccCredit(value : Account) {
    this._accCredit = value;
  }

  getAccDebet() {
    return this._accDebet;
  }

  setAccDebet(value : Account) {
    this._accDebet = value;
  }

  getSum() {
    return this._sum;
  }

  setSum(value : number) {
    this._sum = value;
    this._accDebet.addDebetFlow(this._id, value);
    this._accCredit.addCreditFlow(this._id, value);
  }


  /**
   * Преобразует объект класса в формат JSON
   * @returns JSON-объект
   */
  toJSON() {

    let result : { [key: string]: any } = super.toJSON();

    let accDebet = this.getAccDebet().toJSON();
    result.accDebet = accDebet;

    let accCredit = this.getAccCredit().toJSON();
    result.accCredit = accCredit;

    result.summ = this.getSum();

    return result;

  }

  /**
   * Фрормирует объект из JSON-объекта
   * @param {Object} obj
   */
  parseJSON(obj : AccountingEntryObject) {

    super.parseJSON(obj);

    let accDebet = new Account();
    accDebet.parseJSON(obj.accDebet);
    this.setAccDebet(accDebet);

    let accCredit = new Account();
    accCredit.parseJSON(obj.accCredit);
    this.setAccCredit(accCredit);

    this.setSum(obj.summ);

  }

}