import ServiceProvider from "../ServiceProvider";

export default class SearchProvider extends ServiceProvider {

  constructor(props) {
    super(props);
  }

  // поиск
  search = (searchString, searchObject) => {
    return this._search(searchString, searchObject);
  }

  _search(searchTemplate) {
    if (searchTemplate instanceof Object) {
      return this.templateSearch(searchTemplate);
    }
    else {
      return this.fullTextSearch(searchTemplate);
    }
  }

  // полнотекстовый поиск
  fullTextSearch = (searchString) => {
    return this._fullTextSearch(searchString);
  }

  _fullTextSearch(searchString) {
    return this.getApi().fullTextSearch(searchString)
    .then((docs) => {
      return docs;
    })
    .catch((err) => {
      return Promise.reject(err);
    })
  }

  // поиск документа по шаблону
  templateSearch = (templateObject) => {
    return this._templateSearch(templateObject);
  }

  _templateSearch(templateObject) {
    return this.getApi().templateSearch(templateObject)
    .then((docs) => {
      return docs;
    })
    .catch((err) => {
      return Promise.reject(err);
    })
  }

  // поиск по тэгам
  tagsSearch = (searchString) => {
    return this._tagsSearch(searchString);
  }

  _tagsSearch(searchString) {
    alert(searchString);
  }

  // получение ТОП тэгов
  getTopTags = (topCount) => {
    return this._getTopTags(topCount);
  }

  _getTopTags = (topCount) => {
    return this.getApi().getTopTags(topCount)
    .then((tags) => {
      return tags;
    })
    .catch((err) => {
      return Promise.reject(err);
    })
  }

}