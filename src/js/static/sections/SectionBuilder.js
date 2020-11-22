import AccComponent from '../../common/AccComponent';

/**
 * Базовый класс контентной секции
 */
export default class SectionBuilder extends AccComponent {

  /**
   * Набор карточек
   */
  _cardsList = [];

  /**
   * Количество карточек для показа
   */
  _showStep;

  /**
   * Заголовок секции
   */
  _sectionTitle;


  /**
   * Подзаголовок секции
   */
  _sectionSubtitle;

  /**
   * Класс элемента секции
   */
  _sectionClassName;

  constructor(props) {
    super(props);
    this._cardsList = props.cardsList;
    this._showStep = props.showStep;
    this._sectionTitle = props.sectionTitle;
    this._sectionSubtitle = props.sectionSubtitle;
    this._sectionClassName = props.sectionClassName;
  }


  createDOM() {

    if (this._componentDOM) {
      this.clear();
    }
    this._componentDOM = document.createElement('section');
    this._componentDOM.classList.add(`${this._sectionClassName}`);

    const contentSection = document.createElement('div');
    contentSection.classList.add(`content-section`);

    const sectionBody = `<h2 class="content-section__title">${this._sectionTitle}</h2>
                        <a  class="link content-section__link">
                            <p class="content-section__subtitle">${this._sectionSubtitle}</p>
                        </a>`;

    contentSection.insertAdjacentHTML('afterbegin', sectionBody);

    const container = document.createElement('div');
    container.classList.add('content-section__container');

    contentSection.appendChild(container);

    if (this._cardsList.getCardsListLength() !== 0) {
      this._cardsList.getCardsList().forEach(element => {
        element.createDOM();
        container.appendChild(element.getDOM());
      });
    }

    this._componentDOM.appendChild(contentSection);

  }

  getCardsList() {
    return this._cardsList;
  }

  setCardsList(value) {
    this._cardsList = value;
  }
}