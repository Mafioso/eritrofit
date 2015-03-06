'use strict';

var Permit = React.createClass({
  _render: true,
  // PROPS
  // userId
  // requiredStatus
  componentWillMount: function() {
    // check for rights here
  },
  render: function() {
    var children = null;
    if (this._render) {
      children = this.props.children;
    }
    return (children);
  }
});

module.exports = Permit;
