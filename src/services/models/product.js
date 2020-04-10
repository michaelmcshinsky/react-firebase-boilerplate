export class ProductModel {
  constructor(params) {
    params = params || {};
    Object.assign(this, params);

    this.name = params.name || '';
    this.description = params.description || '';
  }
}
