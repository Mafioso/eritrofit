'use strict';

var Icon = React.createClass({
  render: function() {
    var icon = '<use xlink:href="#'+ this.props.name + '"></use>';
    return (<figure className="icon icon--{ this.props.name }">
      <svg dangerouslySetInnerHTML={{ __html: icon }} />
    </figure>);
  }
});

module.exports = Icon;
