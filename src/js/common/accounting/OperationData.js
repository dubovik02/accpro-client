import AccEntity from '../AccEntity'

/**
 * Класс данных операции
 */
export default class OperationData extends AccEntity {

  /**
   * Дата операции
   */
  _date;

  /**
   * Документ
   */
  _document;

  /**
   * Сумма операции
   */
  _sum;

  constructor() {
    super();
  }

  getDate() {
    return this._date;
  }
  setDate(value) {
    this._date = value;
  }

  getDocument() {
    return this._document;
  }
  setDocument(value) {
    this._document = value;
  }

  getSum() {
    return this._sum;
  }
  setSum(value) {
    this._sum = value;
  }

}