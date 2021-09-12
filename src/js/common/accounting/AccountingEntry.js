import AccEntity from '../AccEntity';

/**
 * Класс бухгалтерской записи
 */

 export default class AccountingEntry extends AccEntity {

  /**
   * Счет по дебету
   */
  _accDebet;

  /**
   * Счет по кредиту
   */
  _accCredit;

  /**
   * Сумма бухгалтерской записи
   */
  _sum;

  constructor() {
    super();
  }

  getAccCredit() {
    return this._accCredit;
  }
  setAccCredit(value) {
    this._accCredit = value;
  }

  getAccDebet() {
    return this._accDebet;
  }
  setAccDebet(value) {
    this._accDebet = value;
  }

  getSum() {
    return this._sum;
  }
  setSum(value) {
    this._sum = value;
    this._accDebet.addDebetFlow(this._id, value);
    this._accCredit.addCreditFlow(this._id, value);
  }

}