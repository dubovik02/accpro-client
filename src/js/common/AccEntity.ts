import GUIDGenerator from './GUIDGenerator';
/**
 * Базовый класс сущности
 */

export default class AccEntity {

  /**
   * Идентификатор сущности
   */
  _id : String;

  /**
   * Имя сущности
   */
  _name : String;

  /**
   * Описание сущности
   */
   _description : String;

  constructor(){
    this._id = GUIDGenerator.createId();
  }

  getId() {
    return this._id;
  }
  setId(value : String) {
    this._id = value;
  }

  getName() {
    return this._name;
  }
  setName(value : String) {
    this._name = value;
  }

  getDescription() {
    return this._description;
  }
  setDescription(value : String) {
    this._description = value;
  }

  toJSON() : Object {
    return {
      id: this.getId(),
      name: this.getName(),
      description: this.getDescription(),
    }
  }

  parseJSON(obj : {id : String; name : String; description : String}) {
    this.setId(obj.id);
    this.setName(obj.name);
    this.setDescription(obj.description);
  }

}