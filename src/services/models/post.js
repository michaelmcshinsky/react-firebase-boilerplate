import moment from 'moment';

export class PostModel {
  constructor (params) {
    const props = { ...params } || {};
    Object.assign(this, props);

    this.name = props.name || '';
    this.title = props.title || '';
    this.summary = props.summary || '';
    this.body = props.body || '';
    this.createdAt = props.createdAt || moment().format();
    this.updatedAt = props.updatedAt || moment().format();
  }
}
