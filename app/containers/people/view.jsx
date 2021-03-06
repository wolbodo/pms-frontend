import _ from 'lodash';
import { push } from 'react-router-redux';
import React, { PropTypes } from 'react';

import { List, Head, Row } from 'components/list';
import fieldComponents from 'components/fields';

import { connectResources, PeopleResource, RolesResource } from 'resources';

@connectResources({
  people: PeopleResource,
  roles: RolesResource,
},
{ pushState: push })
export default class PeopleView extends React.Component {

  static propTypes = {
    roles: PropTypes.object,
    people: PropTypes.object,
    fields: PropTypes.object,
    pushState: PropTypes.func,

    routeParams: PropTypes.object,
  };
  static defaultProps = {
    people: []
  };

  get loaded() {
    const { people, roles } = this.props;

    return people.loaded && roles.loaded;
  }

  render() {
    if (!this.loaded) {
      return (<h1>Loading</h1>);
    }

    const {
      people, roles,
      pushState, routeParams } = this.props;

    // Get the current role/role
    const currentRole = roles.getByName(routeParams.role_name);

    // filter people in current role
    const peopleSet = people.filterByRole(currentRole);

    // Create a select title ;)
    const title = (
      <fieldComponents.Option
        value={_.get(currentRole, 'name', 'all')}
        permissions={{ edit: true }}
        title=""
        options={
          roles._items
               .map((role) => role.get('name'))
               .toMap()
               .flip()
               .map((value, key) => key).toJS()
        }
        onChange={(param) => pushState(`/mensen/${param}`)}
      />
    );

    return (
      <List title={title}>
        <Head schema={people.schema} editLink />
        {_.map(peopleSet, (person) => (
          <Row
            key={person.id}
            item={person}
            schema={people.schema}
            fields={people.schema.header}
            edit={() => pushState(`/lid-${person.id}`)}
          />
        ))}
      </List>
    );
  }
}
