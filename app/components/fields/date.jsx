import React, { PropTypes } from 'react';
import { Form } from 'semantic-ui-react';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

const DateField = ({ title, value, onChange }) => (
  <Form.Field
    label={title}
    control={DatePicker}
    selected={moment(value)}
    onChange={(date) => {
      console.log('changing date', date);
      onChange(date.toDate());
    }}
  />
);
DateField.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  permissions: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
DateField.defaultProps = {
  title: 'Date'
};

export default DateField;
