'use strict';

var Icon = require('./icon.jsx');
var ScrollerItem = require('./scrollerItem.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return({
      defaultDay: ''
    });
  },
  componentWillMount: function() {
    this.setState({
      defaultDay: this.props.currentDay
    });

    // this.state.defaultDay

  },
  componentDidMount: function() {

  },
  render: function() {
    return (
      <div className="scroller">
        <div className="scroller-nav">
          <button onClick={this.handleNegativeShift} className="scroller-nav-btn" type="button">
            <Icon name="arrow-left" />
          </button>
        </div>
        <div className="scroller-week">

        </div>
        <div className="scroller-nav">
          <button onClick={this.handlePositiveShift} className="scroller-nav-btn" type="button">
            <Icon name="arrow-right" />
          </button>
        </div>
      </div>
    );
  }
});
