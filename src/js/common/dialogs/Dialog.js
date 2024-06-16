import AccCopyValueDialog from "./AccCopyValueDialog";
import AccErrorDialog from "./AccErrorDialog";
import AccInfoDialog from "./AccInfoDialog";
import AccYesNoDialog from "./AccYesNoDialog";

export default class Dialog {

  static ErrorDialog(errMsg) {
    new AccErrorDialog(errMsg).open();
  }

  static InfoDialog(infoMsg) {
    new AccInfoDialog(infoMsg).open();
  }

  static CopyValueDialog(title, valueToCopy) {
    new AccCopyValueDialog(title, valueToCopy).open();
  }

  static YesNoDialog(title, question, YesFunc, NoFunc) {
    return new AccYesNoDialog(title, question, YesFunc, NoFunc);
  }

}