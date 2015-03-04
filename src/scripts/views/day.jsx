'use strict';

var Nav = require('../components/nav.jsx');
var Scroller = require('../components/scroller.jsx');
var api = require('../utils/api');
var Workouts = require('../components/workouts.jsx');
var DayActions = require('../actions/DayActions');
var DayStore = require('../stores/DayStore');

module.exports = React.createClass({
  getInitialState: function() {
    return({
      dayData: null,
      workouts: {}
    });
  },
  componentDidMount: function() {
    // CREATE A LISTENER FOR A NEW DAY DATA
    var self = this;
    DayStore.streams.workoutsStream.listen(function(payload) {
      if (payload && payload.key) {
        var workouts = self.state.workouts;
        workouts[payload.key] = payload;
        if (self.isMounted()) {
          self.setState({ workouts: workouts });
        }
      }
    });
    // SETUP DAY DATA STREAMS FOR THE FIRST TIME
    DayActions.setupDayStreams({ day: this.props.params.day });
  },
  componentWillReceiveProps: function(nextProps) {
    // EMPTY CURRENT STATE
    this.setState({ workouts: {}}, function() {
      // UPDATE DAY DATA STREAMS WITH THE NEW DAY
      DayActions.setupDayStreams({ day: nextProps.params.day });
    });
  },
  // componentWillUnmount: function() {
  //   DayStore.streams.workoutsStream.
  // },
  render: function() {
    return (
      <div>
        <Nav
          user={this.props.user}
          username={this.props.username} />
        <Scroller
          day={this.props.params.day} />
        <Workouts
          user={this.props.user}
          items={this.state.workouts}
          day={this.props.params.day} />
      </div>
    );
  }
});
