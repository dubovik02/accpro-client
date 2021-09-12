import AccEntity from '../AccEntity';
/**
 * Класс бухгалтерского счета
 */
 export default class Account extends AccEntity {

  /**
   * Номер счета
   */
  _accNumber;

  /**
   * Наименнование счета
   */
  _accName;

  /**
   * Тип счета (активный, пассивный, активно-пассивный)
   */
  _accType;

  /**
   * Балансовый/не балансовый
   */
  _isNonBalance;

  /**
   * Счет применяется для одинарной записи
   */
  _isOneEntry;

  /**
   * Входящий остаток
   */
  _openBalance = {
    debet: 0,
    credit: 0,
  };

  /**
   * Исходящий остаток
   */
  _closeBalance = {
     debet: 0,
     credit: 0,
   };

  /**
   * Обороты по дебету
   */
  _debetFlow = new Map();


  /**
   * Обороты по кредиту
   */
   _creditFlow = new Map;


  constructor() {
    super();
  }

  getAccNumber() {
    return this._accNumber;
  }

  setAccNumber(value) {
    this._accNumber = value;
  }

  getAccName() {
    return this._accName;
  }

  setAccName(value) {
    this._accName = value;
  }

  getAccType() {
    return this._accType;
  }

  setAccType(value) {
    this._accType = value;
  }

  getIsNonBalance() {
    return this._isNonBalance;
  }

  setIsNonBalance(value) {
    this._isNonBalance = value;
  }

  getIsOneEntry() {
    return this._isOneEntry;
  }
  setIsOneEntry(value) {
    this._isOneEntry = value;
  }

  getOpenBalance() {
    return this._openBalance;
  }
  setOpenBalance(value) {
    this._openBalance = value;
  }

  getCloseBalance() {
    return this._closeBalance;
  }
  setCloseBalance(value) {
    this._closeBalance = value;
  }

  getDebetFlow() {
    return this._debetFlow;
  }
  setDebetFlow(value) {
    this._debetFlow = value;
  }

  getCreditFlow() {
    return this._creditFlow;
  }
  setCreditFlow(value) {
    this._creditFlow = value;
  }

  /**
   * Добавление операции по дебету
   * @param {String} id ид операции
   * @param {Object} operation операция
   */
  addDebetFlow(id, operation) {
    this._debetFlow.set(id, operation);
  }

  /**
   * Добавление операции по кредиту
   * @param {String} id ид операции
   * @param {Object} operation операция
   */
   addCreditFlow(id, operation) {
    this._creditFlow.set(id, operation);
  }

  /**
   * Рассчитывет сумму оборотов по дебету
   */
  calcDebetFlows() {
    const summ = 0;
    this._debetFlow.values.forEach(value => {
      summ = summ + value;
    })
    return summ;
  }

  /**
   * Рассчитывет сумму оборотов по кредиту
   */
   calcCreditFlows() {
    const summ = 0;
    this._creditFlow.values.forEach(value => {
      summ = summ + value;
    })
    return summ;
  }

  /**
   * Рассчитывает исходящий остаток по счету
   * Изначально считаем, что счет активный.
   */
  calcCloseBalance() {

    //входящий остаток
    const income = this._openBalance.debet - this._openBalance.credit;
    //обороты
    const debFlows = this.calcDebetFlows();
    const crFlows = this.calcCreditFlows();
    const flows = debFlows - crFlows;
    //исходящий
    const outcome = income + flows;
    //проверяем знак остатка
    //если плюс - дебетовый, минус - кредитовый
    if (outcome > 0) {
      this._closeBalance = {
        debet: outcome,
        credit: 0,
      }
    }
    else if (outcome < 0) {
      this._closeBalance = {
        debet: 0,
        credit: outcome,
      }
    }
    else {
      this._closeBalance = {
        debet: 0,
        credit: 0,
      }
    }

  }

  /**
   * Объединяет два счета
   * @param {Account} acc счет присоединяемый к текущему
   */
  concat(acc) {

    this._openBalance.debet += acc._openBalance.debet;
    this._openBalance.credit += acc._openBalance.credit;

    for (let entry of acc.getDebetFlow()) {
      this.addDebetFlow(entry[0], entry[1])
    }

    for (let entry of acc.getCreditFlow()) {
      this.addCreditFlow(entry[0], entry[1])
    }

    this._closeBalance.debet += acc._closeBalance.debet;
    this._closeBalance.credit += acc._closeBalance.credit;

  }

}