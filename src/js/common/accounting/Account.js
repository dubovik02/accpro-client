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
    debet: 0.00,
    credit: 0.00,
  };

  /**
   * Исходящий остаток
   */
  _closeBalance = {
     debet: 0.00,
     credit: 0.00,
   };

  /**
   * Обороты по дебету
   */
  _debetFlow = new Map();


  /**
   * Обороты по кредиту
   */
   _creditFlow = new Map();


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

  getDebetFlows() {
    return this._debetFlow;
  }
  setDebetFlows(value) {
    this._debetFlow = value;
  }

  getCreditFlows() {
    return this._creditFlow;
  }
  setCreditFlows(value) {
    this._creditFlow = value;
  }

  /**
   * Добавление операции по дебету
   * @param {String} id ид операции
   * @param {Object} operation операция
   */
  addDebetFlow(id, operation) {
    this._debetFlow.set(id, Number(operation));
  }

  /**
   * Добавление операции по кредиту
   * @param {String} id ид операции
   * @param {Object} operation операция
   */
   addCreditFlow(id, operation) {
    this._creditFlow.set(id, Number(operation));
  }

  /**
   * Рассчитывет сумму оборотов по дебету
   */
  calcDebetFlows() {
    let summ = 0;
    this._debetFlow.values().forEach(value => {
      summ = summ + value;
    })
    return summ;
  }

  /**
   * Рассчитывет сумму оборотов по кредиту
   */
   calcCreditFlows() {
    let summ = 0;
    this._creditFlow.values().forEach(value => {
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
        credit: -1 * outcome,
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
   * Рассчитывает входящий остаток по счету
   * Изначально считаем, что счет активный.
   */
  calcOpenBalance() {

    //исходящий остаток
    const outcome = this._closeBalance.debet - this._closeBalance.credit;
    //обороты
    const debFlows = this.calcDebetFlows();
    const crFlows = this.calcCreditFlows();
    const flows = debFlows - crFlows;
    //исходящий
    const income = outcome - flows;
    //проверяем знак остатка
    //если плюс - дебетовый, минус - кредитовый
    if (income > 0) {
      this._openBalance = {
        debet: income,
        credit: 0,
      }
    }
    else if (income < 0) {
      this._openBalance = {
        debet: 0,
        credit: -1 * income,
      }
    }
    else {
      this._openBalance = {
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

    this._openBalance.debet = this._openBalance.debet + acc._openBalance.debet;
    this._openBalance.credit = this._openBalance.credit + acc._openBalance.credit;

    for (let entry of acc.getDebetFlows()) {
      this.addDebetFlow(entry[0], entry[1])
    }

    for (let entry of acc.getCreditFlows()) {
      this.addCreditFlow(entry[0], entry[1])
    }

    this.calcCloseBalance();

  }

  /**
   * Преобразует объект класса в формат JSON
   * @returns JSON-объект
   */
  toJSON() {
    let result = super.toJSON();

    result.accName = this.getAccName();
    result.accNumber = this.getAccNumber();
    result.accType = this.getAccType();
    result.closeBalance = this.getCloseBalance();
    result.openBalance = this.getOpenBalance();
    result.isNonBalance = this.getIsNonBalance();
    result.isOneEntry = this.getIsOneEntry();

    let debFlowArr = [];
    for (let entry of this.getDebetFlows()) {
      let flow = {
        key: entry[0],
        value: entry[1]
      }
      debFlowArr.push(flow)
    }
    result.debetFlow = debFlowArr;

    let crFlowArr = [];
    for (let entry of this.getCreditFlows()) {
      let flow = {
        key: entry[0],
        value: entry[1]
      }
      crFlowArr.push(flow)
    }
    result.creditFlow = crFlowArr;

    return result;
  }

  /**
   * Формирует объект класса из JSON-объекта
   * @param {Object} obj
   */
  parseJSON(obj) {

    super.parseJSON(obj);
    this.setAccName(obj.accName);
    this.setAccNumber(obj.accNumber);
    this.setAccType(obj.accType);
    this.setCloseBalance(obj.closeBalance);
    this.setOpenBalance(obj.openBalance);
    this.setIsNonBalance(obj.isNonBalance);
    this.setIsOneEntry(obj.isOneEntry);

    for (let entry of obj.debetFlow) {
      this.getDebetFlows().push(entry.key, entry.value);
    }

    for (let entry of obj.creditFlow) {
      this.getCreditFlows().push(entry.key, entry.value);
    }

  }

}