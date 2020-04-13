import moment from 'moment';

export class ProductModel {
  constructor(params) {
    params = params || {};
    Object.assign(this, params);

    this.name = params.name || '';
    this.description = params.description || '';
    this.createdAt = params.createdAt || moment().format();
    this.updatedAt = params.updatedAt || moment().format();
  }
}
