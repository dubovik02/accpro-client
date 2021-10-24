import GUIDGenerator from './GUIDGenerator';
/**
 * Базовый класс сущности
 */

export default class AccEntity {

  /**
   * Идентификатор сущности
   */
  _id;

  /**
   * Имя сущности
   */
  _name;

  /**
   * Описание сущности
   */
   _description;

  constructor(){
    this._id = GUIDGenerator.createId();
  }

  getId() {
    return this._id;
  }
  setId(value) {
    this._id = value;
  }

  getName() {
    return this._name;
  }
  setName(value) {
    this._name = value;
  }

  getDescription() {
    return this._description;
  }
  setDescription(value) {
    this._description = value;
  }

  toJSON() {
    return {
      id: this.getId(),
      name: this.getName(),
      description: this.getDescription(),
    }
  }

  parseJSON(obj) {

    this.setId(obj.id);
    this.setName(obj.name);
    this.setDescription(obj.description);

  }

}