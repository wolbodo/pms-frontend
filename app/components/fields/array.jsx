import React, { PropTypes } from 'react';
import { Form } from 'semantic-ui-react';
import _ from 'lodash';

export default class Array extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.array,
    permissions: PropTypes.object,
    options: PropTypes.array,
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.value, this.state.value)) {
      console.log('Updating state:', this.state.value, '->', nextProps.value);
      this.setState({
        value: nextProps.value || []
      });
    }
  }

  render() {
    const { title, onChange } = this.props;
    const { value, currentValue } = this.state;
    const toItem = (item) => ({ value: item, text: item });

    const options = value
                        .concat(currentValue && !value.includes(currentValue)
                         ? [currentValue]
                         : []
                        )
                        .map(toItem);
    // const values = value.map(toItem);

    console.log('Array:', options, value);

    return (
      <Form.Dropdown fluid multiple search selection selectOnBlur
        noResultsMessage="Typ om nieuwe items te maken"
        label={title}
        value={value}
        options={options}
        onBlur={() => onChange(value)}
        onChange={(ev, data) => this.setState({
          value: data.value,
          currentValue: undefined
        })}
        onSearchChange={(ev, data) => this.setState({
          currentValue: data
        })}
      />
    );
  }
}
