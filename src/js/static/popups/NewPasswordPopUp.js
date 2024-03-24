import SubmitPopUp from "../../common/popups/SubmitPopUp";

export default class NewPasswordPopUp extends SubmitPopUp {

  constructor(props) {
    super(props);
  }

  createDOM() {
    super.createDOM();
  }

  _getInputsValues() {

    return {
      newPass: this._form.elements.password.value,
    }
  }

}