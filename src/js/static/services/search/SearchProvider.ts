import ServiceProvider from "../ServiceProvider";

export default class SearchProvider extends ServiceProvider {

  constructor(props : { [key: string]: any }) {
    super(props);
  }

  // поиск
  search = (searchString : string, searchObject : { [key: string]: any }) => {
    return this._search(searchString, searchObject);
  }

  _search(searchString: string, searchTemplate : { [key: string]: any }) {
    if (searchTemplate instanceof Object) {
      return this.templateSearch(searchTemplate);
    }
    else {
      return this.fullTextSearch(searchString);
    }
  }

  // полнотекстовый поиск
  fullTextSearch = (searchString : string) => {
    return this._fullTextSearch(searchString);
  }

  _fullTextSearch(searchString : string) {
    return this.getApi().fullTextSearch(searchString)
    .then((docs) => {
      return docs;
    })
    .catch((err) => {
      return Promise.reject(err);
    })
  }

  // поиск документа по шаблону
  templateSearch = (templateObject : { [key: string]: any }) => {
    return this._templateSearch(templateObject);
  }

  _templateSearch(templateObject : { [key: string]: any }) {
    return this.getApi().templateSearch(templateObject)
    .then((docs) => {
      return docs;
    })
    .catch((err) => {
      return Promise.reject(err);
    })
  }

  // // поиск по тэгам
  // tagsSearch = (searchString : string) => {
  //   return this._tagsSearch(searchString);
  // }

  // _tagsSearch(searchString : string) {
  //   alert(searchString);
  // }

  // получение ТОП тэгов
  getTopTags = (topCount : number) => {
    return this._getTopTags(topCount);
  }

  _getTopTags = (topCount : number) => {
    return this.getApi().getTopTags(topCount)
    .then((tags) => {
      return tags;
    })
    .catch((err) => {
      return Promise.reject(err);
    })
  }

}