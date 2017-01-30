import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

export function List({ title, buttons, children }) {
  const { heads, rows } = _.groupBy(
    _.flatten(children),
    (child) => ((child.type.name === 'Head') ? 'heads' : 'rows')
  );

  return (
    <div>
      {buttons}
      <h2>{title || 'Lijst'}</h2>
      <Table>
        <Table.Header>{heads}</Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table>
    </div>
  );
}
List.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  buttons: PropTypes.object,
};

export function Head({ schema, fieldLink }) {
  return (
    <Table.Row>
    {schema.header
      .map((fieldname) => schema.properties[fieldname]) // get fields from the fieldname
      .map((field) => (
      <Table.HeaderCell key={field.id}>
      {
        fieldLink ? (
          <Link to={`${fieldLink}/${field.name}`}>{field.title}</Link>
        ) : field.title
      }
      </Table.HeaderCell>
    ))}
    </Table.Row>
  );
}
Head.propTypes = {
  schema: PropTypes.object,
  fieldLink: PropTypes.string,
};

export function Row({ className, item, fields, edit }) {
  return (
    <Table.Row className={className} key={item.name} onClick={edit}>
      {fields.map((field, i) => (
        <Table.Cell key={i}>
          { item[field] }
        </Table.Cell>
      ))}
    </Table.Row>
  );
}
Row.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object,
  fields: PropTypes.array,
  edit: PropTypes.func,
};
