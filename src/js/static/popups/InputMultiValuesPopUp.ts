import SubmitPopUp from "../../common/popups/SubmitPopUp";

export default class InputMultiValuesPopUp extends SubmitPopUp {

  /**
   * Массив полей ввода значений
   */
  _inputs : Array<HTMLInputElement> = [];

  //результирующий объект возвращаемый из попапа
  _resultsObj : { [key: string]: any } = {};


  constructor(prop : { [key: string]: any }) {
    super(prop);
    this._inputs = this.getProps().inputs;
  }

  _getInputsValues() {

    for (let i = 0; i < this._inputs.length; i++) {
      this._resultsObj[i] = this._inputs[i].value;
    }

    return this._resultsObj;
  }

}