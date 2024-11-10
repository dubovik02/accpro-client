import SubmitPopUp from "../../common/popups/SubmitPopUp";

export default class InputValuePopUp extends SubmitPopUp {

  /**
   * Поле ввода значений
   */
  _input : HTMLInputElement;


  constructor(prop : { [key: string]: any }) {
    super(prop);
    this._input = this.getProps().input;
  }

  _getInputsValues() : string {
    return this._input.value;
  }

}