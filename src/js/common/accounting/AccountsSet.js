import AccEntity from "../AccEntity";

/**
 * Класс набора счетов
 */
export default class AccountsSet extends AccEntity {

  /**
   * Набор счетов
   */
  _accountsSet = [];


  constructor() {
    super();
  }

  getAccountsSet() {
    return this._accountsSet;
  }
  setAccountsSet(value) {
    this._accountsSet = value;
  }

  /**
   * Добавление счета в набор
   * @param {Account} account счет для добавления
   */
  add(account) {
    this._accountsSet.push(account);
  }
}