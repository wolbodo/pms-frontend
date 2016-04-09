import _ from 'lodash';
import React, { PropTypes } from 'react';
import * as mdl from 'react-mdl';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Field } from 'components';

import * as groupsActions from 'redux/modules/groups';
import * as fieldsActions from 'redux/modules/fields';

@connect((state) => ({
  auth: state.get('auth').toJS(),
  groups: state.get('groups').toJS(),
  people: state.get('people').toJS(),
  fields: state.get('fields').toJS(),
}), {
  create: groupsActions.create,
  pushState: push,
  fieldsFetch: fieldsActions.fetch,
  groupsFetch: groupsActions.fetch
})
export default class GroupView extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    groups: PropTypes.object,
    people: PropTypes.object,
    fields: PropTypes.object,
    create: PropTypes.func,
    pushState: PropTypes.func,
    fieldsFetch: PropTypes.func,
    groupsFetch: PropTypes.func,
  }
  componentDidMount() {
    this.props.fieldsFetch();
    this.props.groupsFetch();
  }

  renderButtons() {
    const { create } = this.props;

    return (
      <mdl.IconButton
        name="add"
        onClick={() => create.create()}
      />
    );
  }

  render() {
    const {
      groups: { items },
      auth: { permissions },
      people,
      fields } = this.props;
    const schema = _.get(fields, 'items.roles');

    const editFields = ['description'];

    return (
      <div className="content">
      {_.map(items, (group) => (
        <mdl.Card key={group.id} className="mdl-color--white mdl-shadow--2dp">
          <mdl.CardTitle>
            {group.name}
          </mdl.CardTitle>
          <div className="fieldset">
            {_.map(editFields, (field) => (
              <Field
                key={field}
                field={_.get(schema.properties, field)}
                disabled={!_.includes(permissions.roles.edit, field)}
                value={group[field]}
              />
            ))}
          </div>
          <div className="people">
            <Field
              value={_.map(group.people_ids, (id) => _.get(people.items, id))}
              field={{
                type: 'link',
                title: 'Mensen',
                name: 'people',
                target: 'people',
                displayValue: 'nickname',
                getOptions: (value) =>
                  _.filter(people.items,
                    ({ nickname = '' }) =>
                      _.lowerCase(nickname).match(_.lowerCase(value))),
                onBlur: (value, key) => console.log('blur', value, key),
                onChange: (value, key) => console.log('change', value, key)
              }}
            />
          </div>
        </mdl.Card>
      ))}
      </div>
    );

    // return (
    //   <List title="Groepen" buttons={this.renderButtons()}>
    //     <Head schema={schema} editLink />
    //     {_.map(groups.items, (row, i) => (
    //       <Row
    //         className="click"
    //         key={i}
    //         item={row}
    //         fields={schema.header}
    //         edit={ () => pushState(`groepen/${i}`) }
    //       />
    //     ))}
    //   </List>
    // );
  }
}
