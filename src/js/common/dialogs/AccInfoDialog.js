import AccDialog from "./AccDialog";
import iconInfo from '../../../images/info64.png';

/**
 * Класс диалогового окна информации
 */
 export default class AccInfoDialog extends AccDialog {

  _buttonClose;

  constructor(infoMsg) {
    const props = {
      form: null,
      message: infoMsg,
      icon: iconInfo,
    };
    super(props);
  }

  createDOM() {
    super.createDOM();

    const closeHtml = `
                      <button type="button" id="ok" class="button dialog__button">Ok</button>
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