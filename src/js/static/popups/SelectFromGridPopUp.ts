import { GridApi } from "ag-grid-community";
import SubmitPopUp from "../../common/popups/SubmitPopUp";

export default class SelectFromGridPopUp extends SubmitPopUp {

  /**
   * Таблица для выбора значений
   */
  _gridObj : GridApi;


  constructor(prop : { [key: string]: any }) {
    super(prop);
    this._gridObj = this.getProps().gridObj;
  }

  _getInputsValues() {
    return this.getGridObj().getSelectedRows();
  }

  getGridObj() {
    return this._gridObj;
  }

  setGridObj(gridObj : GridApi) {
    this._gridObj = gridObj;
  }

}