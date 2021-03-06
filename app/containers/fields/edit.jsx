import _ from 'lodash';
import { PropTypes } from 'react';
// import { connect } from 'react-redux';

import * as fieldActions from 'redux/modules/fields';
import { connectResources, FieldsResource } from 'resources';

// import { ItemEdit } from 'components';

const FieldsEdit = function FieldsEdit({ params, fields, updateField }) {
  console.log(params, fields, updateField);

  const field = _.get(fields.get(params.resource).properties, params.veld);
  return fields.renderItemEdit(field);
};
FieldsEdit.propTypes = {
  params: PropTypes.object,
  fields: PropTypes.object,
  updateField: PropTypes.func
};

export default connectResources({
  fields: FieldsResource,
}, {
  ...fieldActions
})(FieldsEdit);
