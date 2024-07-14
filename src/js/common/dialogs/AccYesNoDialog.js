import AccDialog from "./AccDialog";
import Properties from "../../properties/Properties";
import iconQuestion from '../../../images/question64.png';

/**
 * Класс диалогового окна запроса Да\Нет
 */
 export default class AccYesNoDialog extends AccDialog {

  _buttonYes;
  _buttonNo;

  constructor(title, question, onYesEvent, onNoEvent, onErrorEvent) {

    const props = {
      form: null,
      title: title,
      message: question,
      icon: iconQuestion,
      onYesEvent: onYesEvent,
      onNoEvent: onNoEvent,
      onErrorEvent: onErrorEvent,
    };
    super(props);
  }

  createDOM() {
    super.createDOM();

    const yesHtml = `
                      <button type="button" id="confirm-ok" class="button dialog__button dialog__button-yes">${Properties.lang.dict.dialogs.yes}</button>
                      `;
    this._buttonsSection.insertAdjacentHTML('beforeend', yesHtml);
    this._buttonYes = this._buttonsSection.querySelector('.dialog__button-yes');

    const noHtml = `
                      <button type="button" id="confirm-no" class="button dialog__button dialog__button-no">${Properties.lang.dict.dialogs.no}</button>
                      `;
    this._buttonsSection.insertAdjacentHTML('beforeend', noHtml);
    this._buttonNo = this._buttonsSection.querySelector('.dialog__button-no');

    this.setActions();
  }

  setActions() {
    this._buttonYes.addEventListener('click', () => {
      this.close();
      if (this._props.onYesEvent instanceof Function) {
        return this._props.onYesEvent.call(this)
        .then((res) => {
        })
        .catch((err) => {
          this._handleError(err);
        })
      }
    });

    this._buttonNo.addEventListener('click', () => {
      this.close();
      if (this._props.onNoEvent instanceof Function) {
        return this._props.onNoEvent.call(this)
        .then((res) => {
        })
        .catch((err) => {
          this._handleError(err);
        });
      }
    });
  }

  _handleError(err) {
    if (this._props.onErrorEvent instanceof Function) {
      this._props.onErrorEvent.call(this, err)
      .then((res) => {

      })
      .catch((err) => {

      });
    }
  }

}