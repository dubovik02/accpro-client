import AccComponent from '../../common/AccComponent';

/**
 * Базовый класс контентной секции
 */
export default class SectionBuilder extends AccComponent {

  /**
   * Набор карточек
   */
  _cardsList;

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
   * Секция-контейнер для карточек
   */
  _contentContainer;

  /**
   * Секция-контейнер для управляющих элементов (преконтентная секция)
   */
  _preBlock;

    /**
   * Секция-контейнер для управляющих элементов (постконтентная секция)
   */
  _postBlock;

  /**
   * Базовый класс элемента секции
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
                         <p class="content-section__subtitle">${this._sectionSubtitle}</p>
                         <div class="content-section__pre-block"></div>
                         <div class="content-section__container"></div>
                         <div class="content-section__post-block"></div>`;

    contentSection.insertAdjacentHTML('afterbegin', sectionBody);

    this._contentContainer = contentSection.querySelector('.content-section__container');
    this._preBlock = contentSection.querySelector('.content-section__pre-block');
    this._postBlock = contentSection.querySelector('.content-section__post-block');

    if (this._cardsList.getCardsListLength() !== 0) {
      this._cardsList.getCardsArray().forEach(element => {
        element.createDOM();
        this._contentContainer.appendChild(element.getDOM());
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

  /**
   * Возвращает секцию-контейнер для управлящих элементов
   */
  getPreBlockDOM() {
    return this._preBlock;
  }

  /**
   * Создает DOM-карточек из текущего списка карточек и добавляет в контентый контейнер
   */
  createCards() {
    if (this._cardsList.getCardsListLength() !== 0) {
      this._cardsList.getCardsArray().forEach(element => {
        element.createDOM();
        this._contentContainer.appendChild(element.getDOM());
      });
    }
  }

  /**
   * Удаляет карточки
   */
  deleteCards() {
    while (this._contentContainer.firstChild) {
      this._contentContainer.removeChild(this._contentContainer.firstChild);
    }
  }
}