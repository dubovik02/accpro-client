/**
 * Фабрика печати в HTML-представлении
 */
export default class PrintFactory {

  constructor() {
  }

  // возвращает HTML представление тетради
  printSbDocToHTML(doc) {

    // тетрадь
    let docContainer = document.createElement('div');
    // атрибуты тетради
    docContainer.insertAdjacentHTML('beforeend',
    `<p>Документ: <span  style="font-weight: bold">${doc.properties.shortdesc}</span></p>`);

    let currentDate = new Date().toLocaleDateString();
    docContainer.insertAdjacentHTML('beforeend',
    `<p>Дата актуализации: ${doc.lastupdate ? new Date(doc.lastupdate).toLocaleDateString() : currentDate}
    Дата печати: ${currentDate}</p>`);

    // docContainer.insertAdjacentHTML('beforeend', this._printDelimeterToHTML());

    // содержание тетради
    let docContent = document.createElement('div');
    docContainer.insertAdjacentElement('beforeend', docContent);


    //входящие
    docContent.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Входящие остатки</span></p>`);
    docContent.insertAdjacentHTML('beforeend', this._printDelimeterToHTML());

    docContent.insertAdjacentHTML('beforeend', this.printSbDocStocksToHTML(doc.text.income));

    // обороты

    docContent.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Обороты</span></p>`);
    docContent.insertAdjacentHTML('beforeend', this._printDelimeterToHTML());

    docContent.insertAdjacentHTML('beforeend', this.printSbDocFlowsToHTML(doc.text.flows.entries));

    // исходящие остатки

    docContent.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Исходящие остатки</span></p>`);
    docContent.insertAdjacentHTML('beforeend', this._printDelimeterToHTML());

    docContent.insertAdjacentHTML('beforeend', this.printSbDocStocksToHTML(doc.text.outcome));

    docContainer.insertAdjacentHTML('beforeend', this._printDelimeterToHTML());

    return docContainer.outerHTML;

  }

  //возвращает HTML-представление таблицы остатков
  printSbDocStocksToHTML(stocksObj) {

    let stocksGrid = document.createElement('div');
    stocksGrid.style = `display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 16px 16px;
    justify-content: flex-start;
    margin: 0;`;

    let counter = 0;
    if (stocksObj) {
      //заголовок
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">#</span></p>`);
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Счет</span></p>`);
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Остаток по дебету</span></p>`);
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Остаток по кредиту</span></p>`);
      stocksGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Пояснение</span></p>`);
      if (stocksObj.accounts) {
        stocksObj.accounts.forEach(element => {
          stocksGrid.insertAdjacentHTML('beforeend', `<p>${counter++}</p>`);
          stocksGrid.insertAdjacentHTML('beforeend', `<p>${element.accNumber}</p>`);
          stocksGrid.insertAdjacentHTML('beforeend',
          `<p>${this._getStringAsDelimeteredNumber("ru", element.closeBalance.debet, '')}</p>`);
          stocksGrid.insertAdjacentHTML('beforeend',
          `<p>${this._getStringAsDelimeteredNumber("ru", element.closeBalance.credit, '')}</p>`);
          stocksGrid.insertAdjacentHTML('beforeend',
          `<p>${element.description ? element.description : ''}</p>`);
        });
      }
    }

    return stocksGrid.outerHTML;
  }

  //возвращает HTML-представление таблицы оборотов
  printSbDocFlowsToHTML(flowsObj) {

    let flowsGrid = document.createElement('div');
    flowsGrid.style = `display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 16px 16px;
    justify-content: flex-start;
    margin: 0;`;

    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">#</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Содержание операции</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Счет по дебету</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Счет по кредиту</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Сумма</span></p>`);
    flowsGrid.insertAdjacentHTML('beforeend', `<p><span style="font-weight: bold">Пояснение</span></p>`);
    let counter = 0;
    if (flowsObj) {
      flowsObj.forEach(element => {
        flowsGrid.insertAdjacentHTML('beforeend', `<p>${counter++}</p>`);
        flowsGrid.insertAdjacentHTML('beforeend', `<p>${element.name}</p>`);
        flowsGrid.insertAdjacentHTML('beforeend',
        `<p>${element.accDebet.accNumber ? element.accDebet.accNumber : ''}</p>`);
        flowsGrid.insertAdjacentHTML('beforeend',
        `<p>${element.accCredit.accNumber ? element.accCredit.accNumber : ''}</p>`);
        flowsGrid.insertAdjacentHTML('beforeend',
        `<p>${this._getStringAsDelimeteredNumber("ru", element.summ, '')}</p>`);
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
  _getStringAsDelimeteredNumber(locale, stringVal, placeholder) {
    let result = this._formatStringAsDelemiteredNumber(locale, stringVal);
    return (result != new Intl.NumberFormat(locale, {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(0)) ? result : placeholder;
  }

  // форматирует число в строковое представление с разделителем
  _formatStringAsDelemiteredNumber(locale, stringVal) {
    let  numberVal= Number(stringVal ? stringVal : '0');
    return new Intl.NumberFormat(locale, {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(numberVal);
  }

}