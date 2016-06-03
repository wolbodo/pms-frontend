import BaseResource from './baseResource';
import actions from 'redux/modules';

export default class PeopleResource extends BaseResource {
  static actions = actions.people;

  get self() {
    // Returns the resource of the current user.
    const userId = this._auth.getIn(['user', 'user']);
    return this.get(userId);
  }

  filterByRole(role) {
    return role ?
      this.filter(
        (person) => person.get('roles')
                          .some((_role) => _role.get('$ref') === `/roles/${role.id}`)
      ) : this.all();
  }
}
