import React, { PropTypes } from 'react';
import { Form } from 'semantic-ui-react';


class ArrayField extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.array,
    permissions: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      options: [
        ...props.options,
        ...props.value.map((value) => ({ text: value, value }))
      ]
    };
  }

  handleChange(ev, { value }) {
    this.props.onChange(value);
  }
  handleAddition(ev, { value }) {
    if (!this.props.value.includes(value)) {
      this.setState({
        options: [{ text: value, value }, ...this.state.options],
      });
    }
  }

  render() {
    const { options } = this.state;
    const { title, value = [] } = this.props;
    const handleAddition = this.handleAddition.bind(this);
    const handleChange = this.handleChange.bind(this);

    return (
      <Form.Dropdown fluid multiple search selection
        allowAdditions
        noResultsMessage="Typ om nieuwe items te maken"
        label={title}
        value={value}
        options={options}
        onAddItem={handleAddition}
        onChange={handleChange}
      />
    );
  }
}

export default ArrayField;
