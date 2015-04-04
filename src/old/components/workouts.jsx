'use strict';

var WorkoutsForm = require('./workoutsForm.jsx');
var WorkoutsItem = require('./workoutsItem.jsx');
// var Permit = require('./permit.jsx');
// var DayActions = require('../actions/DayActions');
// var DayStore = require('../stores/DayStore');
var _ = require('lodash');
var moment = require('moment');

var Workouts = React.createClass({
  propTypes: {
    showSubmit: React.PropTypes.func,
    showWorkoutDetails: React.PropTypes.func,
    user: React.PropTypes.string,
    username: React.PropTypes.string,
    items: React.PropTypes.object,
    day: React.PropTypes.string,
  },
  render: function() {
    var self = this;
    // sort workouts by addition date
    var workoutBlobs = _.sortBy(_.values(this.props.items), function(blob) {
      return moment(blob.timestamp);
    });

    var workouts = _.map(workoutBlobs, function(workout) {
      return (
        <WorkoutsItem
          key={workout.key}
          showSubmit={self.props.showSubmit}
          showWorkoutDetails={self.props.showWorkoutDetails}
          day={self.props.day}
          user={self.props.user}
          workout={workout} />
      );
    });
    return(
      <div className='workouts-container'>
        <ul className='workouts'>
          {workouts}
        </ul>
        <WorkoutsForm
          user={self.props.user}
          username={self.props.username}
          day={this.props.day} />
      </div>
    );
  }
});

module.exports = Workouts;
