
/**
 * Объект таблицы остатков
 */
export type StockGridObject = {
  accountNumber: string,
  debet: number,
  credit: number,
  note: string,
}

/**
 * Объект таблицы потоков
 */
export type FlowGridObject = {
  operationDesc: string,
  debet: string,
  credit: string,
  summ: number,
  note: string,
}

/**
 * Объект тетради
 */
export type NotebookGridObject = {
  income : Array<StockGridObject>,
  flows: Array<FlowGridObject>,
  outcome: Array<StockGridObject>
}

/**
 * Объект свойств тетради
 */
export type NotebookPropertiesObject = {
  shortdesc: string,
  description: string,
  tags: string,
}