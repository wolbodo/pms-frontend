import React, { PropTypes } from 'react';

import { Form } from 'semantic-ui-react';

const Boolean = ({ title, value, className, onChange }) => (
  <Form.Checkbox toggle
    label={title}
    checked={value}
    className={className}
    onChange={(ev, data) => onChange(data.checked)}
  />
);
Boolean.propTypes = {
  title: PropTypes.string,
  value: PropTypes.bool,
  className: PropTypes.string,
  permissions: PropTypes.object,
  onChange: PropTypes.func.isRequired
};
Boolean.defaultProps = {
  title: 'Boolean'
};

export default Boolean;
