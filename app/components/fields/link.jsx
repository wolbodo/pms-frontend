import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import AutoComplete from 'material-ui/lib/auto-complete';
// import MenuItem from 'material-ui/lib/menus/menu-item';

import { Chip } from 'components';


export default class Link extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.array,
    disabled: PropTypes.bool,
    options: PropTypes.object,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    displayValue: PropTypes.string,
  };
  static defaultProps = {
    title: 'Array'
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  onChange(index) {
    const { onBlur, value } = this.props;

    if (onBlur) {
      onBlur(
        _.filter(value, (x, i) => i !== index)
      );
    }
  }

  addValue({ target }) {
    const newValue = _.trim(target.textContent);
    const { onBlur, value } = this.props;

    // FIXME: Never assign like this in react...
    target.textContent = undefined; // eslint-disable-line

    if (!_.isEmpty(newValue)) {
      onBlur(
        _(value || []).concat(newValue).value()
      );
    }
  }
  deleteValue() {
    const { onBlur, value } = this.props;

    onBlur(_.slice(value, 0, -1));
  }

  handleKeyPress(event) {
    if (event.key === 'Backspace' && _.isEmpty(event.target.textContent)) {
      this.deleteValue();
    }

    if (event.key === 'Enter') {
      this.addValue(event);
    }
  }

  render() {
    const { title, value, options, displayValue, onChange } = this.props;

    const listToDisplay = (item) => _.get(item, _.toPath(displayValue));
    // Shows an array of strings for now.
    return (
      <div
        className="link-list"
        onClick={() => this._input && ReactDOM.findDOMNode(this._input).focus()}
      >
        <div>
        { _.map(_.map(value, listToDisplay), (item, i) => (
          <Chip key={i}>
            {item}
            <i className="material-icons"
              onClick={() => this.onChange(i)}
            >cancel</i>
          </Chip>
        ))}
          <AutoComplete className="auto-complete"
            ref={(el) => {this._input = el;}}
            floatingLabelText="Nieuw..."
            filter={AutoComplete.fuzzyFilter}
            onNewRequest={(val) => onChange(_.find(options, (opt) => opt.name === val))}
            dataSource={_.map(options, listToDisplay)}
          />
        </div><label className="link-list--label">{title}</label>
      </div>
    );
  }
}
