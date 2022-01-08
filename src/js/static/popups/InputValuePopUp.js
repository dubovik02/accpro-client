import SubmitPopUp from "../../common/popups/SubmitPopUp";

export default class InputValuePopUp extends SubmitPopUp {

  /**
   * Поле ввода значений
   */
  _input;


  constructor(prop) {
    super(prop);
    this._input = this.getProps().input;
  }

  _getInputsValues() {
    return this._input.value;
  }

}