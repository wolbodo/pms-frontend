import React, { PropTypes } from 'react';
import { connectResources, RolesResource } from 'resources';

const RoleView = ({ roles }) => (
  <div className="content">
  {roles.map((role) => roles.renderItemEdit(role))}
  </div>
);
RoleView.propTypes = {
  roles: PropTypes.object,
};

export default connectResources({
  roles: RolesResource,
})(RoleView);
