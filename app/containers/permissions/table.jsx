import React, { PropTypes } from 'react';
import * as mdl from 'react-mdl';
import { connect } from 'react-redux';

import { change } from 'redux/modules/permissions';
import { Dialog, FlatButton } from 'material-ui';

import _ from 'lodash';

import { Link } from 'react-router';

class PermissionsDialog extends React.Component {
  static propTypes = {
    dialogState: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = props.dialogState;
  }
  componentWillReceiveProps(nextProps) {
    // Receiving props from upper component
    if (!_.isEqual(this.props.dialogState, nextProps.dialogState)) {
      this.setState(nextProps.dialogState || {
        schema: undefined,
        group: undefined,
        field: undefined,
        read: false,
        write: false
      });
    }
  }

  handleChange(type, value) {
    this.setState({
      [type]: value
    });
  }

  render() {
    const { onClose, onSubmit } = this.props;
    const { group, field, read, write } = this.state || {};

    const dialogOpen = group && field;

    const actions = [
      <FlatButton
        secondary
        label="Annuleren"
        onTouchTap={onClose}
      />,
      <FlatButton
        primary
        label="Opslaan"
        onTouchTap={() => onSubmit(this.state)}
      />,
    ];

    return (
      <Dialog
        title="Permissies wijzigen"
        className="permissions-dialog"
        actions={actions}
        open={!!dialogOpen}
        onRequestClose={onClose}
      >
        { !!dialogOpen && (
          <div>
            <p>
              Voor de personen in
              <span className="group">"{group.name}"</span>
              op het veld
              <span className="field">"{field.label}"</span>
            </p>
            <div className="switches">
              <div>
                <mdl.Switch
                  ripple
                  id="read"
                  checked={read}
                  onChange={({ target }) =>
                    this.handleChange('read', target.checked)
                  }
                >Lezen</mdl.Switch>
              </div>
              <div>
                <mdl.Switch
                  ripple
                  id="write"
                  checked={write}
                  onChange={({ target }) =>
                    this.handleChange('write', target.checked)
                  }
                >Wijzigen</mdl.Switch>
              </div>
            </div>
          </div>
      ) || (<div />)}
      </Dialog>
    );
  }
}

@connect((state) => ({ ...state.toJS() }), {
  change
})
export default class PermissionsView extends React.Component {
  static propTypes = {
    permissions: PropTypes.object,
    groups: PropTypes.object,
    fields: PropTypes.object,
    change: PropTypes.func,
  };
  constructor(props) {
    super(props);

    this.state = {};
  }
  getPermissions(group, schema, field) {
    const { permissions } = this.props;
    const read = _.includes(_.get(permissions, [group.id, schema, 'read']), field.name);
    const write = _.includes(_.get(permissions, [group.id, schema, 'write']), field.name);

    return { read, write };
  }

  closeDialog() {
    this.setState({
      dialogState: undefined
    });
  }
  showDialog(state) {
    const { permissions } = this.props;
    this.setState({
      dialogState: _.assign(state, {
        read: _.includes(permissions[state.group.id][state.schema].read, state.field.name),
        write: _.includes(permissions[state.group.id][state.schema].write, state.field.name)
      })
    });
  }

  submitResult(result) {
    this.props.change(result);
    this.closeDialog();
  }

  renderHeading() {
    const { groups } = this.props;

    return (
      <thead>
        <tr>
          <th></th>
          {_.map(groups.items, (group, id) => (
            <th key={id} className="mdl-data-table__cell--non-numeric">
              <Link to={`/groepen/${id}`}>
                {group.name}
              </Link>
            </th>
          ))}
          <th></th>
          <th>Zelf</th>
        </tr>
      </thead>
    );
  }
  renderSchema(schema, key) {
    const { groups } = this.props;

    return [
      (<tr key={`heading-${key}`}>
        <th>{schema.name}</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>)
    ].concat(
      _.map(schema.properties, (field, i) => (
        <tr key={`${key}-${i}`}>
          <th>
            <Link to={`/velden/${field.name}`}>
              {field.label}
            </Link>
          </th>
          {_.map(groups.items, (group, j) =>
            (<td key={j}>
              <span
                className="permission"
                onClick={() => this.showDialog({ schema: key, group, field })}
              >
              { (({ read, write }) =>
                [read ? <i key={'read'} className="icon">visibility</i>
                    : <i key={'read'} className="icon dimmed">visibility_off</i>,
                  write ? <i key={'write'} className="icon">edit</i>
                      : <i key={'write'} className="icon dimmed">edit</i>
                ]
                )(this.getPermissions(group, key, field))
              }
              </span>
            </td>)
          )}
          <td></td>
          <td>
            <span
              className="permission"
              onClick={() => this.showDialog({ schema: key, group: 'self', field })}
            >
            { (({ read, write }) =>
              [read ? <i key="read" className="icon">visibility</i>
                  : <i key="read" className="icon dimmed">visibility_off</i>,
                write ? <i key="write" className="icon">edit</i>
                    : <i key="write" className="icon dimmed">edit</i>
              ]
              )(this.getPermissions('self', key, field))
            }
            </span>
          </td>
        </tr>
      ))
    );
  }
  renderBody() {
    const { fields } = this.props;
    return (
      <tbody>
        { _.map(fields.schemas, (schema, i) => this.renderSchema(schema, i)) }
      </tbody>
    );
  }

  render() {
    let { dialogState } = this.state;

    return (
      <mdl.Card className="content permissions mdl-color--white mdl-shadow--2dp">
        <mdl.CardTitle>
          Permissies
        </mdl.CardTitle>
        <mdl.CardText>
          <table className="mdl-data-table mdl-js-data-table">
            { this.renderHeading() }
            { this.renderBody() }
          </table>
          <PermissionsDialog
            dialogState={dialogState}
            onSubmit={(result) => this.submitResult(result)}
            onClose={() => this.closeDialog()}
          />
        </mdl.CardText>
      </mdl.Card>
    );
  }
}
