import AccPopup from "./AccPopup";

export default class AccMessageDialog extends AccPopup {

  _buttonClose;

  constructor(message) {
    const props = {
      title: message,
      form: null,
      butOpen: null,
    }
    super(props);
    this.createDOM();
  }

  createDOM() {
    super.createDOM();
    this._createCloseButton();
    this._contentSection.appendChild(this._buttonClose);
  }

  _createCloseButton() {
    this._buttonClose = document.createElement('button');
    this._buttonClose.classList.add('button');
    this._buttonClose.classList.add('popup__button');
    this._buttonClose.textContent = ('OK');
    this._buttonClose.addEventListener('click', () => {
      this.close();
    });
  }

}