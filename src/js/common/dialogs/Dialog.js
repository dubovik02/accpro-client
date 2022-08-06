import AccCopyValueDialog from "./AccCopyValueDialog";
import AccErrorDialog from "./AccErrorDialog";
import AccInfoDialog from "./AccInfoDialog";

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

}