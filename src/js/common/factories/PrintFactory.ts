import Properties from '../../properties/Properties';
import { AccountsSetObject } from '../accounting/AccObjects';
import { AccountingEntriesSetObject } from '../accounting/AccObjects';
import { SandBoxDocumentObject } from '../documents/DocumentsObjects';

/**
 * Фабрика печати в HTML-представлении
 */
export default class PrintFactory {

  constructor() {
  }

  // возвращает HTML представление тетради
  printSbDocToHTML(doc : SandBoxDocumentObject) : string {

    // тетрадь
    let docContainer = document.createElement('div');
    // атрибуты тетради
    docContainer.insertAdjacentHTML('beforeend',
    `<p>${Properties.lang.dict.general.document}: <span  style="font-weight: bold">${doc.properties.shortdesc}</span></p>`);

    let currentDate = new Date().toLocaleDateString();
    docContainer.insertAdjacentHTML('beforeend',
    `<p>${Properties.lang.dict.notebook.create}: ${doc.lastupdate ? new Date(doc.lastupdate).toLocaleDateString() : currentDate}
    ${Properties.lang.dict.print.dateOfPrint}: ${currentDate}</p>`);

    // содержание тетради
    let docContent = document.createElement('div');
    docContainer.insertAdjacentElement('beforeend', docContent);

    //входящие
    docContent.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.incomeTitle}</span></p>`);
    docContent.insertAdjacentHTML('beforeend', this._printDelimeterToHTML());

    docContent.insertAdjacentHTML('beforeend', this.printSbDocStocksToHTML(doc.text.income));

    // обороты
    docContent.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.flowTitle}</span></p>`);
    docContent.insertAdjacentHTML('beforeend', this._printDelimeterToHTML());

    docContent.insertAdjacentHTML('beforeend', this.printSbDocFlowsToHTML(doc.text.flows));

    // исходящие остатки
    docContent.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.outcomeTitle}</span></p>`);
    docContent.insertAdjacentHTML('beforeend', this._printDelimeterToHTML());

    docContent.insertAdjacentHTML('beforeend', this.printSbDocStocksToHTML(doc.text.outcome));

    docContainer.insertAdjacentHTML('beforeend', this._printDelimeterToHTML());

    return docContainer.outerHTML;

  }

  //возвращает HTML-представление таблицы остатков
  printSbDocStocksToHTML(stocksObj : AccountsSetObject) : string {

    let stocksGrid = document.createElement('div');
    stocksGrid.style.display = 'grid';
    stocksGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    stocksGrid.style.gap = '16px 16px';
    stocksGrid.style.justifyContent = 'flex-start';
    stocksGrid.style.margin = '0';

    let counter = 0;
    if (stocksObj) {
      //заголовок
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">#</span></p>`);
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.account}</span></p>`);
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.debitStock}</span></p>`);
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.creditStock}</span></p>`);
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.note}</span></p>`);
      if (stocksObj.accounts) {
        stocksObj.accounts.forEach(element => {
          stocksGrid.insertAdjacentHTML('beforeend', `<p>${counter++}</p>`);
          stocksGrid.insertAdjacentHTML('beforeend', `<p>${element.accNumber}</p>`);
          stocksGrid.insertAdjacentHTML('beforeend',
          `<p>${this._getStringAsDelimeteredNumber("ru", element.closeBalance.debet.toString(), '')}</p>`);
          stocksGrid.insertAdjacentHTML('beforeend',
          `<p>${this._getStringAsDelimeteredNumber("ru", element.closeBalance.credit.toString(), '')}</p>`);
          stocksGrid.insertAdjacentHTML('beforeend',
          `<p>${element.description ? element.description : ''}</p>`);
        });
      }
    }

    return stocksGrid.outerHTML;
  }

  //возвращает HTML-представление таблицы оборотов
  printSbDocFlowsToHTML(flowsObj : AccountingEntriesSetObject) {

    let flowsGrid : HTMLDivElement = document.createElement('div');
    flowsGrid.style.display = 'grid';
    flowsGrid.style.gridTemplateColumns = 'repeat(6, 1fr)';
    flowsGrid.style.gap = '16px 16px';
    flowsGrid.style.justifyContent = 'flex-start';
    flowsGrid.style.margin = '0';

    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">#</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.flowNote}</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.accDebit}</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.accCredit}</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.summ}</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">${Properties.lang.dict.sandbox.grids.note}</span></p>`);
    let counter = 0;
    if (flowsObj) {
        flowsObj.entries.forEach(element => {

          flowsGrid.insertAdjacentHTML('beforeend', `<p>${counter++}</p>`);
          flowsGrid.insertAdjacentHTML('beforeend', `<p>${element.name ? element.name : ''}</p>`);
          flowsGrid.insertAdjacentHTML('beforeend',
          `<p>${element.accDebet.accNumber ? element.accDebet.accNumber : ''}</p>`);
          flowsGrid.insertAdjacentHTML('beforeend',
          `<p>${element.accCredit.accNumber ? element.accCredit.accNumber : ''}</p>`);
          flowsGrid.insertAdjacentHTML('beforeend',
          `<p>${this._getStringAsDelimeteredNumber("ru", element.summ.toString(), '')}</p>`);
          flowsGrid.insertAdjacentHTML('beforeend',
          `<p>${element.description ? element.description : ''}</p>`);

        })
    }

    return flowsGrid.outerHTML;
  }

  // линия разделитель в формате HTML с заданным цветом
  _printDelimeterToHTML() {
    return `<hr style="border-bottom: 1px solid rgb(101, 121, 155);">`;
  }

  // возвращает представление строки, как числа с разделителем или placeholder если ноль или null
  _getStringAsDelimeteredNumber(locale : string, stringVal : string, placeholder : string) {
    let result = this._formatStringAsDelemiteredNumber(locale, stringVal);
    return (result != new Intl.NumberFormat(locale, {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(0)) ? result : placeholder;
  }

  // форматирует число в строковое представление с разделителем
  _formatStringAsDelemiteredNumber(locale : string, stringVal : string) {
    let  numberVal= Number(stringVal ? stringVal : '0');
    return new Intl.NumberFormat(locale, {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(numberVal);
  }

}