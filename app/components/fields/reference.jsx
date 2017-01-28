import React, { PropTypes } from 'react';
import { Dropdown, Form } from 'semantic-ui-react';
// import _ from 'lodash';

const List = ({
  title,
  value, options,
  className,
  // permissions,
  // target,
  onChange,
  // resource, displayValue
}) => (
  <Form.Field className={className}>
    <label>{title}</label>
    <Dropdown
      placeholder={title}
      value={value}
      options={options}
      onChange={(ev, data) => onChange(data.value)}
      fluid multiple search selection
    />
  </Form.Field>
);
List.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.array,
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  // permissions: PropTypes.object,
  // target: PropTypes.string,
  // onBlur: PropTypes.func.isRequired,
  // resource: PropTypes.object.isRequired,
  // displayValue: PropTypes.string,
};

export default List;
