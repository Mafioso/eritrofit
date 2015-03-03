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
      dayData: null
    });
  },
  componentWillMount: function() {
    // CREATE A LISTENER FOR A NEW DAY DATA
    var self = this;
    DayStore.streams.setDay.listen(function(payload) {
      console.log(payload, 'dayData');
      self.setState({
        dayData: payload
      });
    });
  },
  componentDidMount: function() {
    // UDPATE DAY DATA FIRST TIME
    DayActions.getDay({ day: this.props.params.day });
  },
  componentWillReceiveProps: function(nextProps) {
    // UDPATE DAY DATA ON PROPS UPDATE
    DayActions.getDay({ day: nextProps.params.day });
  },
  render: function() {
    console.log(this.props.params.day, 'dayId');
    return (
      <div>
        <Nav username={api.getCurrentUserEmail()} />
        <Scroller activeDay={this.props.params.day} />
          <Workouts
            dayId={this.props.params.day}
            dayData={this.state.dayData} />
      </div>
    );
  }
});
