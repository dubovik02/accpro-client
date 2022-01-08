import SubmitPopUp from "../../common/popups/SubmitPopUp";

export default class SelectFromGridPopUp extends SubmitPopUp {

  /**
   * Таблица для выбора значений
   */
  _gridObj;


  constructor(prop) {
    super(prop);
    this._gridObj = this.getProps().gridObj;
  }

  _getInputsValues() {
    return this.getGridObj().gridOptions.api.getSelectedRows();
  }

  getGridObj() {
    return this._gridObj;
  }

  setGridObj(gridObj) {
    this._gridObj = gridObj;
  }

}