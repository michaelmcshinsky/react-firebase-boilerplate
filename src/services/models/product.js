import moment from 'moment';

export class ProductModel {
  constructor (params) {
    const props = { ...params } || {};
    Object.assign(this, props);

    this.name = props.name || '';
    this.description = props.description || '';
    this.createdAt = props.createdAt || moment().format();
    this.updatedAt = props.updatedAt || moment().format();
  }
}
