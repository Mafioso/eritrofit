'use strict';

var Nav = require('../components/nav.jsx');
var ScrollerItem = require('../components/ScrollerItem.jsx');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <Nav />
        <ScrollerItem day='280215' active={false} />
        <ScrollerItem day='010315' active={true} />
        <ScrollerItem day='020315' active={false} />
        {this.props.params.day}
      </div>
    );
  }
});
