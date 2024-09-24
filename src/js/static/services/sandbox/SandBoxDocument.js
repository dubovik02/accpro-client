import Properties from "../../../properties/Properties";

/**
 * Класс документа песочницы
 */
export default class SandBoxDocument {

  _id = undefined;

  lastupdate = new Date().getTime();

  likes = [];

  owner = undefined;

  properties = {
    shortdesc: `${Properties.lang.dict.notebook.myNotebook}`,
    description: `${Properties.lang.dict.notebook.myDescription}`,
    tags: `${Properties.lang.dict.notebook.myTags}`,
  };

  share = false;

  text = {
    income: {},
    flows: {},
    outcome: {},
  };

  views = 0;


  SandBoxDocument() {
  }

  getId() {
    return this._id;
  }
  setId(value) {
    this._id = value;
  }

  getLastupdate() {
    return this.lastupdate;
  }
  setLastupdate(value) {
    this.lastupdate = value;
  }

  getLikes() {
    return this.likes;
  }
  setLikes(value) {
    this.likes = value;
  }

  getOwner() {
    return this.owner;
  }
  setOwner(value) {
    this.owner = value;
  }

  getShare() {
    return this.share;
  }
  setShare(value) {
    this.share = value;
  }

  getProperties() {
    return this.properties;
  }
  setProperties(value) {
    this.properties = value;
  }

  getText() {
    return this.text;
  }
  setText(value) {
    this.text = value;
  }

  getViews() {
    return this.views;
  }
  setViews(value) {
    this.views = value;
  }

  copyDocument(srcDoc) {
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
      _id: this._id,
      lastupdate: this.lastupdate,
      likes: this.likes,
      owner: this.owner,
      properties: this.properties,
      share: this.share,
      text: this.text,
      views: this.views,
    }
  }

  loadDocumentFromJSON(docObj) {
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