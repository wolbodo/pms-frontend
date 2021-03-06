import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Card } from 'semantic-ui-react';

import {
  DragSource as dragSource,
  DropTarget as dropTarget,
  DragDropContext as dragDropContext
} from 'react-dnd';
// import Backend from 'react-dnd-touch-backend';
import Backend from 'react-dnd-html5-backend';

import * as fieldActions from 'redux/modules/fields';

const ItemTypes = {
  FIELD: Symbol('field'),
  GROUP: Symbol('group')
};

function getDragDirection(component, monitor) {
  // Determine rectangle on screen
  const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

  // Get vertical middle
  const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  // Determine mouse position
  const clientOffset = monitor.getClientOffset();

  // Get pixels to the top
  const hoverClientX = clientOffset.x - hoverBoundingRect.left;
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  // Only perform the move when the mouse has crossed half of the items height
  // When dragging downwards, only move when the cursor is below 50%
  // When dragging upwards, only move when the cursor is above 50%
  return {
    up: hoverClientY < hoverMiddleY,
    down: hoverClientY > hoverMiddleY,
    left: hoverClientX < hoverMiddleX,
    right: hoverClientX > hoverMiddleX
  };
}
// Index depths
const FIELD = 2;
const SET = 1;
const GROUP = 0;

/**
 * Implements the drag source contract.
 */
const fieldSource = {
  beginDrag(props) {
    console.log('returning dragged field item', props);

    return {
      index: props.index,
      moveField: props.moveField,
      addSet: props.addSet
    };
  }
};
const fieldTarget = {

  hover(props, monitor, component) {
    const item = monitor.getItem();
    const direction = getDragDirection(component, monitor);

    if ( // were working on the same fieldset
      (item.index[GROUP] === props.index[GROUP])
       &&
      (item.index[SET] === props.index[SET])
       &&
      (
        // if items are being dropped on the same spot
        (_.isEqual(item.index, props.index))
        ||
        // if items will return on the same spot.
        (item.index[FIELD] + (direction.left ? 1 : -1) === props.index[FIELD])
      )
    ) {
      component.setState({
        direction: undefined
      });
      return;
    }
    component.setState({ direction });
  },
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const direction = getDragDirection(component, monitor);
    const toIndex = props.index;

    if ( // were working on the same fieldset
      (item.index[GROUP] === props.index[GROUP])
       &&
      (item.index[SET] === props.index[SET])
       &&
      (
      // if items are being dropped on the same spot
      (_.isEqual(item.index, props.index))
      ||
      // if items will return on the same spot.
      (item.index[FIELD] + (direction.left ? 1 : -1) === props.index[FIELD])
      )
    ) {
      component.setState({ direction: undefined });
      return;
    }

    if (direction.right) {
      // we should be adding behind the target
      toIndex[FIELD] += 1;
    }

    props.moveField(item.index, toIndex);
  }
};

const fieldSetTarget = {

  hover(props, monitor, component) {
    const direction = getDragDirection(component, monitor);

    component.setState({
      direction
    });
  },
  drop(props, monitor, component) {
    const item = monitor.getItem();

    if (!monitor.isOver({ shallow: true })) {
      // its being handle by fields
      return;
    }

    const direction = component.state.direction;
    const toIndex = props.index;

    if (direction.down) {
      // we should be adding behind the target
      toIndex[SET] += 1;
    }

    props.addSet(item.index, toIndex);
  }
};

// const groupsource = {
//   beginDrag(props) {
//     index: props.index
//   }
// }

const groupTarget = {
};


function targetCollect(_connect, monitor) {
  return {
    connectDropTarget: _connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true })
  };
}
function sourceCollect(_connect, monitor) {
  return {
    connectDragSource: _connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

@dragSource(ItemTypes.FIELD, fieldSource, sourceCollect)
@dropTarget(ItemTypes.FIELD, fieldTarget, targetCollect)
class Field extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    getFieldURI: PropTypes.func,

    field: PropTypes.object,
    isOver: PropTypes.bool,
    direction: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);

    this.state = {};
  }

  mouseOver() {
    this.setState({ hover: true });
  }

  mouseOut() {
    this.setState({ hover: false });
  }

  render() {
    const {
      isDragging, connectDragSource, connectDropTarget,
      field, isOver, getFieldURI,
      direction
    } = this.props;

    return connectDragSource(connectDropTarget(
      <div
        onMouseOver={this.mouseOver}
        onMouseOut={this.mouseOut}
        className={classnames('field', isOver && direction)}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <Link to={getFieldURI(field.name)}>
        {field.title}
        </Link>
      </div>
    ));
  }
}

@dropTarget(ItemTypes.FIELD, fieldSetTarget, targetCollect)
class FieldSet extends React.Component {
  static propTypes = {
  // Injected by React DnD:
    connectDropTarget: PropTypes.func.isRequired,

    fields: PropTypes.array,
    schema: PropTypes.object,
    index: PropTypes.array,
    isOver: PropTypes.bool,
    getFieldURI: PropTypes.func,
    direction: PropTypes.bool,

    addSet: PropTypes.func,
    moveField: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isOver, connectDropTarget, index, fields,
      moveField, addSet, schema, getFieldURI } = this.props;
    const { direction } = this.state;

    return connectDropTarget(
      <div className={classnames('fieldset', isOver && direction) } >
        { _.map(fields, (field, i) =>
          <Field
            key={i}
            getFieldURI={getFieldURI}
            index={index.concat(i)}
            field={{
              name: field,
              ...schema.properties[field]
            }}
            moveField={moveField}
            addSet={addSet}
          />
        )}
      </div>
    );
  }
}

// @dragSource(ItemTypes.GROUP, groupsource, sourceCollect)
@dropTarget(ItemTypes.FIELD, groupTarget, targetCollect)
class Group extends React.Component {
  static propTypes = {
    // connectDragSource: PropTypes.func.isRequired,
    // isDragging: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool,

    fieldsets: PropTypes.array,
    schema: PropTypes.object,
    title: PropTypes.string,
    index: PropTypes.number,
    getFieldURI: PropTypes.func,

    moveField: PropTypes.func,
    addSet: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      fieldsets: this.props.fieldsets
    };
  }
  componentWillReceiveProps(props) {
    if (!_.isEqual(props.fieldsets, this.props.fieldsets)) {
      this.setState({
        fieldsets: props.fieldsets
      });
    }
  }

  render() {
    const { isOver, connectDropTarget, title, index,
      moveField, addSet, schema, getFieldURI } = this.props;
    const { fieldsets } = this.state;

    return connectDropTarget(
      <div className={classnames('ui', 'card', { hover: isOver })}>
        <Card.Content>
          <Card.Header>{title}</Card.Header>
          <Card.Description>
          { _.map(fieldsets, (fieldset, i) =>
            <FieldSet
              fields={fieldset}
              moveField={moveField}
              getFieldURI={getFieldURI}
              schema={schema}
              addSet={addSet}
              key={i}
              index={[index, i]}
            />
          )}
          </Card.Description>
        </Card.Content>
      </div>
    );
  }
}

@connect((state) => ({
  fields: state.get('fields').toJS()
}), {
  ...fieldActions
})
@dragDropContext(Backend)
export default class FieldsView extends React.Component {
  static propTypes = {
    moveField: PropTypes.func,
    createSet: PropTypes.func,
    fields: PropTypes.object,
    params: PropTypes.object
  }
  constructor(props) {
    super(props);

    this.moveField = this.moveField.bind(this);
    this.addSet = this.addSet.bind(this);
  }

  moveField(fromIndex, toIndex) {
    const { moveField } = this.props;

    moveField('people', fromIndex, toIndex);
  }

  addSet(fromIndex, toIndex) {
    const { createSet } = this.props;

    createSet('people', fromIndex, toIndex);
  }

  render() {
    const { fields, params } = this.props;
    console.log('View params', params);
    const table = params.resource || 'people';

    return (
      <Card.Group className="fields-view">
      { _.map(fields.items[table].form, (group, i) =>
        <Group
          key={i}
          index={i}
          getFieldURI={(name) => `/velden/${table}/${name}`}
          moveField={this.moveField}
          schema={fields.items[table]}
          addSet={this.addSet}
          title={group.title}
          fieldsets={group.fields}
        />
      )}
      </Card.Group>
    );
  }
}

