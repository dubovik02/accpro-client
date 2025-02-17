import AccDialog from "./AccDialog";
import iconInfo from '../../../images/clipboard64.png';
import Dialog from "./Dialog";
import Properties from "../../properties/Properties";


/**
 * Класс диалогового окна показа и копирования информации
 */
 export default class AccCopyValueDialog extends AccDialog {

  _buttonCopy : HTMLButtonElement;
  _buttonClose : HTMLButtonElement;

  constructor(title : string, valueToCopy : string) {
    const props = {
      // form: null,
      title: title,
      message: valueToCopy,
      icon: iconInfo,
    };
    super(props);
  }

  createDOM() {
    super.createDOM();

    const closeHtml = `
                      <button type="button" id="ok" class="button dialog__button dialog__button-ok">${Properties.lang.dict.dialogs.close}</button>
                      `;
    this._buttonsSection.insertAdjacentHTML('afterbegin', closeHtml);
    this._buttonClose = this._buttonsSection.querySelector('.dialog__button-ok');

    const copyHtml = `
                      <button type="button" id="copy" class="button dialog__button dialog__button-copy">${Properties.lang.dict.dialogs.copy}</button>
                      `;
    this._buttonsSection.insertAdjacentHTML('afterbegin', copyHtml);
    this._buttonCopy = this._buttonsSection.querySelector('.dialog__button-copy');

    this.setActions();
  }

  setActions() {
    this._buttonClose.addEventListener('click', () => {
      this.close();
    });

    this._buttonCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(this._props.message)
        .then(() => {
          this._buttonCopy.textContent = `${Properties.lang.dict.popups.copied}`;
        })
        .catch(err => {
          Dialog.ErrorDialog(`${Properties.lang.dict.errors.copyToBufferError}. ${err}`);
        });

    });
  }

 }