import { AccTypes } from "./AccEnums";

/**
 * JSON-представление счета
 */
export type AccountObject = {
  id : String,
  name : String,
  description : String,
  accName : String;
  accNumber : String;
  accType : AccTypes;
  closeBalance : {debet : number; credit : number},
  openBalance : {debet : number; credit : number},
  isNonBalance : Boolean,
  isOneEntry : Boolean,
  debetFlow : Map<String, number>,
  creditFlow : Map<String, Number>,
}

/**
 * JSON-представление набора счетов
 */
export type AccountsSetObject = {
  id : String,
  name : String,
  description : String,
  accounts : Array<AccountObject>
}

/**
 * JSON-представление проводки
 */
export type AccountingEntryObject = {
  id: String;
  name : String;
  description: String;
  accDebet : AccountObject;
  accCredit : AccountObject,
  summ : number
}

/**
 * JSON-представление набора проводок
 */
export type AccountingEntriesSetObject = {
  id : String,
  name : String,
  description : String,
  entries : Array<AccountingEntryObject>
}