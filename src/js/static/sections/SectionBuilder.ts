import AccComponent from '../../common/AccComponent';

/**
 * Базовый класс контентной секции
 */
export default class SectionBuilder extends AccComponent {

  /**
   * Заголовок секции
   */
  _sectionTitle : string;

  /**
   * Базовый класс элемента секции
   */
  _sectionClassName : string;

  /**
   * Подзаголовок секции
   */
  _sectionSubtitle : string;

  /**
   * Секция-контейнер для карточек
   */
  _contentContainer : HTMLElement;

  /**
   * Секция-контейнер для управляющих элементов (преконтентная секция)
   */
  _preBlock : HTMLElement;

    /**
   * Секция-контейнер для управляющих элементов (постконтентная секция)
   */
  _postBlock : HTMLElement;


  constructor(props : { [key: string]: any }) {
    super(props);
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

    this._componentDOM.appendChild(contentSection);

  }

  /**
   * Возвращает секцию-контейнер для управлящих элементов
   */
  getPreBlockDOM() {
    return this._preBlock;
  }

}