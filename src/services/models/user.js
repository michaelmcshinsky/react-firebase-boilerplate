import moment from 'moment';

export class UserModel {
  constructor (params) {
    const props = { ...params } || {};
    Object.assign(this, props);

    this.firstName = props.firstName || '';
    this.lastName = props.lastName || '';
    this.displayName = props.displayName || '';
    this.email = props.email || '';
    this.roles = props.roles || [];
    this.createdAt = props.createdAt || moment().format();
    this.updatedAt = props.updatedAt || moment().format();
  }
}
