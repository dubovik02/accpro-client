import AccComponent from "../AccComponent";

/**
 * Набор карточек
 */
export default class CardsList extends AccComponent {

  _cardsArray;
  //_cardListMap;

  constructor(props) {
    super(props);
    this._cardsArray = [];
    //this._cardListMap = new Map();
  }

  getCardsArray() {
    return this._cardsArray;
  }

  getCard(cardIdx) {
    return this._cardsArray[cardIdx];
  }

  getCardsListLength() {
    return this._cardsArray.length;
  }

  addCard(card) {
    this._cardsArray.push(card);
    // if (!this._cardListMap.has(card.getCardData().keyword)) {
    //   this._cardListMap.set(card.getCardData().keyword, 1);
    // }
    // else {
    //   let value = this._cardListMap.get(card.getCardData().keyword);
    //   this._cardListMap.set(card.getCardData().keyword, value + 1);
    // }
  }

  // getArticlesStat() {

  //   //сортируем мэп по значениям
  //   const sortedCardListMap = new Map([...this._cardListMap.entries()].sort((a, b) => b[1] - a[1]));

  //   const keyWordsArr = [];
  //   // цикл по ключам
  //   for(let word of sortedCardListMap.keys()) {
  //     keyWordsArr.push(word);
  //   }

  //   return {
  //     keywords: keyWordsArr,
  //   }
  // }

  /**
   * Возвращает Map "ключевое слово" : "количество"
   */
  // getKeyWordsMap() {
  //   return this._cardListMap;
  // }

  /**
   * Очистка набора
   */
  clear() {
    this._cardsArray = [];
    //this._cardListMap = new Map();
  }

}