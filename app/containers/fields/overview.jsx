import React, { PropTypes } from 'react';
import { connectResources, FieldsResource } from 'resources';
import { Menu } from 'semantic-ui-react';
import _ from 'lodash';
import * as fieldActions from 'redux/modules/fields';

import { push } from 'react-router-redux';

const FieldsOverview = ({ params, content, pushState }) => {
  const active = params.resource || 'people';
  const tabs = ['people', 'fields', 'roles']
    .map((tab) => ({
      key: tab,
      active: (active === tab),
      name: _.capitalize(tab),
      onClick: () => pushState(`/velden/${tab}`)
    }));

  return (
    <div>
      <Menu items={tabs} />
      { content }
    </div>
  );
};
FieldsOverview.propTypes = {
  params: PropTypes.object,
  fields: PropTypes.object,
  history: PropTypes.object,
  updateField: PropTypes.func,
  pushState: PropTypes.func,
  content: PropTypes.element,
};

export default connectResources({
  fields: FieldsResource,
}, {
  ...fieldActions,
  pushState: push
})(FieldsOverview);
