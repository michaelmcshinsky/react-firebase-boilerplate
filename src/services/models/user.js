import moment from 'moment';

export class UserModel {
  constructor(params) {
    params = params || {};
    Object.assign(this, params);

    this.firstName = params.firstName || '';
    this.lastName = params.lastName || '';
    this.displayName = params.displayName || '';
    this.email = params.email || '';
    this.createdAt = params.createdAt || moment().format();
    this.updatedAt = params.updatedAt || moment().format();
  }
}
