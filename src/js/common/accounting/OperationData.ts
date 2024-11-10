import AccEntity from '../AccEntity'

/**
 * Класс данных операции
 */
export default class OperationData extends AccEntity {

  /**
   * Дата операции
   */
  _date = new Date();

  /**
   * Документ
   */
  _document : { [key: string]: any };

  /**
   * Сумма операции
   */
  _sum : number;

  constructor() {
    super();
  }

  getDate() {
    return this._date;
  }
  setDate(value : Date) {
    this._date = value;
  }

  getDocument() {
    return this._document;
  }
  setDocument(value : { [key: string]: any }) {
    this._document = value;
  }

  getSum() {
    return this._sum;
  }
  setSum(value : number) {
    this._sum = value;
  }

}