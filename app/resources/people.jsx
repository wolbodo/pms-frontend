import BaseResource from './baseResource';
import actions from 'redux/modules';

import _ from 'lodash';

export default class PeopleResource extends BaseResource {
  static actions = actions.people;

  get self() {
    // Returns the resource of the current user.
    const userId = this._auth.getIn(['user', 'user']);
    return this.get(userId);
  }

  filterByRole(role) {
    // _.map(role.members(), ({ $ref }) =>
    return role ?
    _.map(role.members(), ({ $ref }) => $ref.match('^\\/people\\/(\\d+)$')[1])
     .map((id) => this.get(id))
      : this.all();
  }
}
