import AccComponent from "../AccComponent";
import Properties from '../../properties/Properties';

/**
 * Карточка (новости, сервисы и т.п.)
 */
export default class Card extends AccComponent {

  //_cardIndex;
  //_cardData;
  //_cardDOM;
  //_bookButton;
  //_isLoggedIn;
  //_onClick;
  //_afterDelete;
  //_remark;
  //_style;

  //_DEFAULT_IMAGE_URL = properties.card.defaultImage;

  constructor(cardProp) {
    super(cardProp);
    // this._cardData = cardProp.cardData;
    // this._cardData.keyword = cardProp.keyword;
    //this._isLoggedIn = cardProp.isLoggedIn;
    //this._onClick = cardProp.onClick;
    //this._style = cardProp.style;
    //this._afterDelete = cardProp.afterDelete;
  }

  /* <a class="card-link" href="#" target="_blank">
    <p class="card-link__theme">Учет</p>
    <img src="https://images.unsplash.com/photo-1503694978374-8a2fa686963a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" alt="image" class="card-link__image">
    <p class="card-link__title">Письмо МФ РФ от 12.12.2020 № 123456789</p>
    <p class="card-link__description">Порядок отражения в бюджетном учете расходов на НИОКР</p>
    <p class="card-link__date">1 апреля, 2020 года</p>
  </a> */

  createDOM() {

    this._componentDOM = document.createElement('a');
    this._componentDOM.classList.add('card-link');
    this._componentDOM.setAttribute('href', this._props.url);
    this._componentDOM.setAttribute('target', '_blank');

    const date = new Date(this._props.publishedAt);
    const dateStr = this._parseDate(date);

    const imgUrl = this._props.urlToImage !== null ? this._props.urlToImage : Properties.card.defaultImg;

    const cardBody = `<p class="card-link__theme">${this._props.keyWord}</p>
                      <img src="${imgUrl}" alt="${this._props.title}" class="card-link__image">
                      <p class="card-link__title">${this._props.title}</p>
                      <p class="card-link__description">${this._props.description}</p>
                      <div class="card-link__source-container">
                        <p class="card-link__source">${this._props.source}</p>
                        <p class="card-link__date">${dateStr}</p>
                      </div>`;

    this._componentDOM.insertAdjacentHTML('afterbegin', cardBody);

    /*------------------------------------ */
    // const cardImageContainer = document.createElement('div');
    // cardImageContainer.classList.add('card__image-container');

    // const imgEl = document.createElement('img');
    // imgEl.classList.add('card__image');

    // if (!this._cardData.urlToImage) {
    //   imgEl.setAttribute('src', this._DEFAULT_IMAGE_URL);
    //   this._cardData.urlToImage = this._DEFAULT_IMAGE_URL;
    // } else {
    //   imgEl.setAttribute('src', this._cardData.urlToImage);
    // }

    // imgEl.setAttribute('alt', this._cardData.title);
    // cardImageContainer.appendChild(imgEl);

    // if (this._style === this._CARD_SAVED_STYLE) {
    //   this.makeDeletableCard(cardImageContainer);
    // } else if (this._style === this._CARD_SEARCH_STYLE) {
    //   this.makeBookableCard(cardImageContainer);
    // }

    /*------------------------------------ */
    // const cardDesc = document.createElement('div');
    // cardDesc.classList.add('card__description');

    // const cardDate = document.createElement('p');
    // cardDate.classList.add('card__date');
    // const date = new Date(this._cardData.publishedAt);
    // const dateStr = this._parseDate(date);
    // cardDate.textContent = dateStr;

    // const cardTitle = document.createElement('h3');
    // cardTitle.classList.add('card__title');
    // cardTitle.textContent = this._cardData.title;

    // const cardSubtitle = document.createElement('p');
    // cardSubtitle.classList.add('card__subtitle');
    // cardSubtitle.textContent = this._cardData.description;

    // const cardSource = document.createElement('p');
    // cardSource.classList.add('card__source');
    // cardSource.textContent = this._cardData.source.name;

    // cardDesc.appendChild(cardDate);
    // cardDesc.appendChild(cardTitle);
    // cardDesc.appendChild(cardSubtitle);
    // cardDesc.appendChild(cardSource);
    /*-----------------------------------------*/
    // this._componentDOM.appendChild(cardImageContainer);
    // this._componentDOM.appendChild(cardDesc);

  }

  // _book = (event) => {

  //   event.preventDefault();
  //   this._onClick.call(this, this._cardData)
  //   .then((res) => {
  //     this._bookButton.classList.add('card__book-icon_marked');
  //   })
  //   .catch((err) => {
  //     alert(err);
  //   })

  // };

  // _delete = (event) => {

  //   event.preventDefault();
  //   this._onClick.call(this, this._cardData._id)
  //   .then((res) => {
  //     this._componentDOM.remove();
  //     this._bookButton.removeEventListener('click', this._delete);
  //     if (this.getAfterDeleteFunction() instanceof Function) {
  //       this.getAfterDeleteFunction().call(this, []);
  //     }
  //   })
  //   .catch((err) => {
  //     alert(err);
  //   })
  // };

  // setAfterDeleteFunction(func) {
  //   this._afterDelete = func;
  // }

  // getAfterDeleteFunction() {
  //   return this._afterDelete;
  // }

  // _setBookListener() {
  //   this._bookButton.addEventListener('click', this._book);
  // };

  // _setDelListener() {
  //   this._bookButton.addEventListener('click', this._delete);
  // };


  _parseDate(date) {
    const monthesStr = Properties.card.monthesStr;
    return `${date.getDate()} ${monthesStr[date.getMonth()]}, ${date.getFullYear()}`;
  }

  // getCardData() {
  //   return this._cardData;
  // }

  // makeBookableCard(rootEl) {

  //   this._bookButton = document.createElement('div');
  //   this._bookButton.classList.add('card__book-button');
  //   this._bookButton.classList.add('card__book-icon');


  //   const markStyle = this._isLoggedIn ? '_hover' : '_normal';
  //   this._bookButton.classList.add(`card__book-icon${markStyle}`);

  //   rootEl.appendChild(this._bookButton);

  //   if (!this._isLoggedIn) {
  //     this._remark = document.createElement('div');
  //     this._remark.classList.add('card__login-msg');
  //     this._remark.textContent = properties.card.saveMessage;
  //     rootEl.appendChild(this._remark);
  //   }
  //   else {
  //     this._setBookListener();
  //   }

  // }

  // makeDeletableCard(rootEl) {

  //   this._bookButton = document.createElement('div');
  //   this._bookButton.classList.add('card__trash-button');
  //   this._bookButton.classList.add('card__trash-icon');

  //   const trashMsg = document.createElement('div');
  //   trashMsg.classList.add('card__trash-msg');
  //   trashMsg.textContent = properties.card.delMessage;

  //   const keyWord = document.createElement('div');
  //   keyWord.classList.add('card__word-msg');
  //   keyWord.textContent = this._cardData.keyword;

  //   rootEl.appendChild(this._bookButton);
  //   rootEl.appendChild(trashMsg);
  //   rootEl.appendChild(keyWord);

  //   this._setDelListener();

  // }
}