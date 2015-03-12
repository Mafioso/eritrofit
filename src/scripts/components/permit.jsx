'use strict';

var Permit = React.createClass({
  propTypes:{
    validate: React.PropTypes.func.isRequired
  },
  render: function() {
    if (this.props.validate()) {
      return this.props.children;
    } else {
      return null;
    }
  }
});

module.exports = Permit;
