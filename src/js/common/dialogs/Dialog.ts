import AccCopyValueDialog from "./AccCopyValueDialog";
import AccErrorDialog from "./AccErrorDialog";
import AccInfoDialog from "./AccInfoDialog";
import AccYesNoDialog from "./AccYesNoDialog";

export default class Dialog {

  static ErrorDialog(errMsg : string) {
    new AccErrorDialog(errMsg).open();
  }

  static InfoDialog(infoMsg : string) {
    new AccInfoDialog(infoMsg).open();
  }

  static CopyValueDialog(title : string, valueToCopy : string) {
    new AccCopyValueDialog(title, valueToCopy).open();
  }

  static YesNoDialog(title : string, question : string, YesFunc : Function, NoFunc : Function, ErrFunc : Function) {
    new AccYesNoDialog(title, question, YesFunc, NoFunc, ErrFunc).open();
  }

}