import AccDialog from "./AccDialog";
import iconError from '../../../images/error64.png';

/**
 * Класс диалогового окна ошибки
 */
 export default class AccErrorDialog extends AccDialog {

  _buttonClose;

  constructor(errMsg) {
    const props = {
      form: null,
      message: errMsg,
      icon: iconError,
    };
    super(props);
  }

  createDOM() {
    super.createDOM();

    const closeHtml = `
                      <button type="button" id="close" class="button dialog__button">Закрыть</button>
                      `;
    this._buttonsSection.insertAdjacentHTML('afterbegin', closeHtml);

    this._buttonClose = this._buttonsSection.querySelector('.dialog__button');

    this.setActions();
  }

  setActions() {
    this._buttonClose.addEventListener('click', () => {
      this.close();
    })
  }

 }