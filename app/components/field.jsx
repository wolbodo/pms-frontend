import _ from 'lodash';
import React, { PropTypes } from 'react';
import fields from './fields';

export default class Field extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array,
      React.PropTypes.bool,
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    field: PropTypes.object,
    resource: PropTypes.object,
    permissions: PropTypes.object,
    options: PropTypes.object,
    onChange: PropTypes.func,
  };

  static FieldTypeMap = {
    string: fields.Text,
    option: fields.Option,
    // enum: fields.Enum,
    boolean: fields.Boolean,
    array: fields.Array,
    date: fields.Date,
    reference: fields.List,
  };

  constructor(props) {
    super(props);

    this.state = this.computeReferenceValue();
  }

  componentWillReceiveProps(props) {
    if (!_.isEqual(props.value, this.props.value)) {
      this.setState(this.computeReferenceValue(props));
    }
  }

  computeReferenceValue(props) {
    const { value, resource, field: { target, displayValue, type } } = props || this.props;

    if (type === 'reference') {
      console.log('Computing references for field');
      const values = value.map((item) => _.get(item.$ref.match(`^\\/${target}\\/(\\d+)$`), 1))
                          .map((item) => resource.get(item))
                          .map((item) => item.id);

      const options = _.map(resource.all(),
                          (item) => ({
                            value: item.id,
                            text: _.get(item, _.toPath(displayValue), `@/${target}/${item.id}`)
                          }));

      return {
        value: values,
        options
      };
    }
    return { value };
  }

  handleChange(newValue) {
    const { value, field: { type, name, target }, onChange } = this.props;
    let _value = newValue;

    if (type === 'reference') {
      // Map array<int> into array<{ref}>
      // Keep existing gids.

      _value = _value
        .map((id) => `/${target}/${id}`)
        .map((ref) => {
          const oldref = value.find(({ $ref }) => ref === $ref);
          if (oldref) {
            return oldref;
          }
          return {
            $ref: ref
          };
        });
    }

    onChange(_value, name);
  }

  render() {
    const { field, permissions, resource } = this.props;
    const { value } = this.state;

    const options = this.state.options || field.options;

    // select field edit component. Default to string
    let Comp = _.get(Field.FieldTypeMap, _.get(field, 'type', 'string'));

    return (
      <Comp
        {...field}
        className={`field-${field.type}`}
        permissions={permissions}
        value={value}
        options={options}
        resource={resource} // For links
        onChange={(_value) => this.handleChange(_value)}
      />
    );
  }
}
