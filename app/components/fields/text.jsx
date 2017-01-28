import React, { PropTypes } from 'react';
import { Form, Input } from 'semantic-ui-react';
import _ from 'lodash';

export default class Text extends React.Component {
  static propTypes = {
    // name: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string,
    permissions: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentWillReceiveProps(props) {
    if (!_.isEqual(props.value, this.state.value)) {
      console.log('2:: ->>', props, this.state);
      console.log('      |', this.props.value);
      this.setState({
        value: props.value
      });
    }
  }

  render() {
    const {
      title, permissions, className, onChange
    } = this.props;
    const { value } = this.state;

    return permissions.edit ? (
        <Form.Field className={className}>
          <label>{title}</label>
          <Input
            disabled={!permissions.edit}
            onChange={(ev, data) => this.setState({ value: data.value })}
            value={value}
            fluid
          >
            <input
              onBlur={() => {
                if (value !== this.props.value) {
                  onChange(value);
                }
              }}
            />
          </Input>
        </Form.Field>
      ) : (
      <Form.Field className={className}>
        <label>{title}</label>
        <p>{value}</p>
      </Form.Field>
    );
  }
}
