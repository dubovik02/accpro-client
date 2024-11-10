import { SandBoxDocumentObject, SandBoxDocumentPropertiesObject, SandBoxDocumentTextObject } from "./DocumentsObjects";
import Properties from "../../properties/Properties";

/**
 * Класс документа песочницы
 */
export default class SandBoxDocument {

  private _docData : SandBoxDocumentObject = {
    _id: "",
    lastupdate: undefined,
    likes: [],
    owner: "",
    properties: {
      shortdesc: "",
      description: "",
      tags: ""
    },
    share: false,
    text: {
      income: {
        id: undefined,
        name: undefined,
        description: undefined,
        accounts: []
      },
      flows: {
        id: undefined,
        name: undefined,
        description: undefined,
        entries: []
      },
      outcome: {
        id: undefined,
        name: undefined,
        description: undefined,
        accounts: []
      }
    },
    views: 0
  };


  constructor() {
    this.setId(undefined);
    this.setLastupdate(new Date());
    this.setLikes([]);
    this.setOwner(undefined);
    this.setShare(false);
    this.setProperties( {
      shortdesc: `${Properties.lang.dict.notebook.myNotebook}`,
      description: `${Properties.lang.dict.notebook.myDescription}`,
      tags: `${Properties.lang.dict.notebook.myTags}`,
    } );
    this.setText( {
      income: {
        id: undefined,
        name: undefined,
        description: undefined,
        accounts: []
      },
      flows : {
        id: undefined,
        name: undefined,
        description: undefined,
        entries: []
      },
      outcome : {
        id: undefined,
        name: undefined,
        description: undefined,
        accounts: []
      }
    } );
  }

  getId() {
    return this._docData._id;
  }
  setId(value : string) {
    this._docData._id = value;
  }

  getLastupdate() {
    return this._docData.lastupdate;
  }
  setLastupdate(value : Date) {
    this._docData.lastupdate = value;
  }

  getLikes() {
    return this._docData.likes;
  }
  setLikes(value : Array<string>) {
    this._docData.likes = value;
  }

  getOwner() {
    return this._docData.owner;
  }
  setOwner(value : string) {
    this._docData.owner = value;
  }

  getShare() {
    return this._docData.share;
  }
  setShare(value : boolean) {
    this._docData.share = value;
  }

  getProperties() {
    return this._docData.properties;
  }
  setProperties(value : SandBoxDocumentPropertiesObject) {
    this._docData.properties = value;
  }

  getText() {
    return this._docData.text;
  }

  setText(value : SandBoxDocumentTextObject) {
    this._docData.text = value;
  }

  getViews() {
    return this._docData.views;
  }
  setViews(value : number) {
    this._docData.views = value;
  }

  copyDocument(srcDoc : SandBoxDocument) {
    this.setId(srcDoc.getId());
    this.setLastupdate(srcDoc.getLastupdate());
    this.setLikes(srcDoc.getLikes());
    this.setOwner(srcDoc.getOwner());
    this.setProperties(srcDoc.getProperties());
    this.setShare(srcDoc.getShare());
    this.setText(srcDoc.getText());
    this.setViews(srcDoc.getViews());
  }

  getDocumentAsJSON() {
    return {
      _id: this.getId(),
      lastupdate: this.getLastupdate(),
      likes: this.getLikes(),
      owner: this.getOwner(),
      properties: this.getProperties(),
      share: this.getShare(),
      text: this.getText(),
      views: this.getViews(),
    }
  }

  loadDocumentFromJSON(docObj : SandBoxDocumentObject) {
    this.setId(docObj._id);
    this.setLastupdate(docObj.lastupdate);
    this.setLikes(docObj.likes);
    this.setOwner(docObj.owner);
    this.setProperties(docObj.properties);
    this.setShare(docObj.share);
    this.setText(docObj.text);
    this.setViews(docObj.views);
  }

}