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
  _sum  = 0;

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


  /**
   * Преобразует объект класса в формат JSON
   * @returns JSON-объект
   */
  toJSON() {

    let result = super.toJSON();

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
  parseJSON(obj) {

    super.parseJSON(obj);

    let accDebet = new AccountingEntry();
    accDebet.parseJSON(obj.accDebet);
    this.setAccDebet(accDebet);

    let accCredit = new AccountingEntry();
    accCredit.parseJSON(obj.accCredit);
    this.setAccCredit(accCredit);

    this.setSum(obj.summ);

  }

}