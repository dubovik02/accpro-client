import { AccountingEntriesSetObject, AccountsSetObject } from "../accounting/AccObjects";

/**
 * Документ песочницы
 */
export type SandBoxDocumentObject = {
  _id: string;
  lastupdate: Date,
  likes: string[],
  owner: string,
  properties: SandBoxDocumentPropertiesObject,
  share: boolean,
  text: SandBoxDocumentTextObject,
  views: number,
}

/**
 * Ткекст документа песочницы
 */
export type SandBoxDocumentTextObject = {
  income: AccountsSetObject,
  flows: AccountingEntriesSetObject,
  outcome: AccountsSetObject,
}

/**
 * Свойства документа песочницы
 */
export type SandBoxDocumentPropertiesObject = {
  shortdesc: string,
  description: string,
  tags: string,
}