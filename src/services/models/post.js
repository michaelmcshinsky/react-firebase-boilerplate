import moment from 'moment';

export class PostModel {
  constructor(params) {
    params = params || {};
    Object.assign(this, params);

    this.name = params.name || '';
    this.title = params.title || '';
    this.summary = params.summary || '';
    this.body = params.body || '';
    this.createdAt = params.createdAt || moment().format();
    this.updatedAt = params.updatedAt || moment().format();
  }
}
