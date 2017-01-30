import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Form } from 'semantic-ui-react';

export default class Option extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.object.isRequired,
    permissions: PropTypes.object,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };
  static defaultProps = {
    title: 'Option'
  };

  render() {
    const {
      value,
      permissions,
      options,
      onChange,
      className, title
    } = this.props;
    return (
      <Form.Dropdown fluid search selection selectOnBlur
        disabled={!permissions.edit}
        className={className}
        label={title}
        value={value}
        options={_.map(options, (_value, key) => ({ text: _value, value: key }))}
        onChange={(ev, data) => onChange(data.value)}
      />
    );
  }
}
