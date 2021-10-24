import AccountingEntriesSet from "../../../common/accounting/AccountingEntriesSet";
import AccountingEntry from "../../../common/accounting/AccountingEntry";
import AccountsSet from "../../../common/accounting/AccountsSet";
import Account from "../../../common/accounting/Account";
import ServiceProvider from "../ServiceProvider";

/**
 * Провайдер сервиса Песочницы
 */
 export default class SandBoxProvider extends ServiceProvider {

  constructor(props) {
    super(props)
  }


  /**
   * Метод расчета остатков и оборотов
   * @param {AccountsSet} incomeAccSet входящие остатки
   * @param {AccountingEntriesSet} entriesSet обороты
   * @param {AccountsSet} outcomeAccSet исходящие остатки
   * @param {Number} calcMode режим расчета (0 - входящие, 1 - обороты, 2 - исходящие)
   */
   calcStocksAndFlows(incomeAccSet, entriesSet, outcomeAccSet, calcMode) {

    //смотрим, что надо вычислять
    if (calcMode == 0) {
      //outcomeAccSet.calcIncomesByFlows(entriesSet);
      outcomeAccSet.calcStocks(entriesSet, true);
      return outcomeAccSet.toJSON();
    }
    if (calcMode == 2) {
      //incomeAccSet.calcOutcomesByFlows(entriesSet);
      incomeAccSet.calcStocks(entriesSet, false);
      return incomeAccSet.toJSON();
    }
  }

  /**
   * Метод формирования набора счетов из массива объектов-строк
   * @param {Array} stockArr остатки
   */
  transformStocks(stockArr) {

    //собираем остатки
    const accSet = new AccountsSet();

    stockArr.forEach(accObj => {

      if (accObj.accountNumber != null) {
        const acc = new Account();
        acc.setAccNumber(accObj.accountNumber);
        acc.setOpenBalance({
          debet: accObj.debet == null ? 0 : accObj.debet,
          credit: accObj.credit == null ? 0 : accObj.credit,
        });
        acc.setCloseBalance({
          debet: accObj.debet == null ? 0 : accObj.debet,
          credit: accObj.credit == null ? 0 : accObj.credit,
        });
        acc.setDescription(accObj.note);
        accSet.add(acc);
      }

    })

    return accSet;
  }

  /**
   * Метод формирования оборотов из массива объектов-строк
   * @param {Array} flowsArr обороты
   */
  transformFlows(flowsArr) {

    //собираем обороты
    const flowsSet = new AccountingEntriesSet();
    flowsArr.forEach(entryObj => {

      //не берем пустые счета
      if ((entryObj.debet != null) && (entryObj.credit != null)) {
        const entry = new AccountingEntry();
        entry.setName(entryObj.operationDesc);

        const accDebet = new Account();
        accDebet.setAccNumber(entryObj.debet)
        entry.setAccDebet(accDebet);

        const accCredit = new Account();
        accCredit.setAccNumber(entryObj.credit);
        entry.setAccCredit(accCredit);

        entry.setDescription(entryObj.note);
        entry.setSum(entryObj.summ == null ? 0 : entryObj.summ);

        flowsSet.add(entry);
      }

    })

    return flowsSet;
  }

}