'use strict';

var Icon = require('./icon.jsx');
var ScrollerItem = require('./scrollerItem.jsx');
var moment = require('moment');


module.exports = React.createClass({
  getInitialState: function() {
    return({
      currentDay: ''
    });
  },
  componentWillMount: function() {
    this.setState({
      currentDay: this.props.activeDay
    });
  },
  handleNegativeShift: function() {
    this.setState({
      currentDay: moment(this.state.currentDay, 'DDMMYY').subtract(1, 'day').format('DDMMYY')
    });
  },
  handlePositiveShift: function() {
    this.setState({
      currentDay: moment(this.state.currentDay, 'DDMMYY').add(1, 'day').format('DDMMYY')
    });
  },
  render: function() {
    var prevDay = moment(this.state.currentDay, 'DDMMYY').subtract(1, 'day').format('DDMMYY');
    var nextDay = moment(this.state.currentDay, 'DDMMYY').add(1, 'day').format('DDMMYY');

    return (
      <div className="scroller">
        <div className="scroller-nav">
          <button onClick={this.handleNegativeShift} className="scroller-nav-btn" type="button">
            <Icon name="arrow-left" />
          </button>
        </div>
        <div className="scroller-week">
          <ScrollerItem key={prevDay} day={prevDay} activeDay={this.props.activeDay} />
          <ScrollerItem key={this.state.currentDay} day={this.state.currentDay} activeDay={this.props.activeDay} />
          <ScrollerItem key={nextDay} day={nextDay} activeDay={this.props.activeDay} />
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
