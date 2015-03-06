'use strict';

var WorkoutsForm = require('./workoutsForm.jsx');
var WorkoutsItem = require('./workoutsItem.jsx');
var Permit = require('./permit.jsx');
var DayActions = require('../actions/DayActions');
var DayStore = require('../stores/DayStore');
var _ = require('lodash');

var Workouts = React.createClass({
  getInitialState: function() {
    return ({

    });
  },
  render: function() {
    var self = this;
    var workoutIdx = 0;
    var workouts = _.map(_.values(this.props.items), function(workout) {
      workoutIdx += 1;
      return (
        <WorkoutsItem
          user={self.props.user}
          key={workout.key}
          workoutId={workout.key}
          index={workoutIdx}
          author={workout.author}
          timestamp={workout.timestamp}
          editedTimestamp={workout.editedTimestamp}
          username={workout.username}
          text={workout.text}
          day={self.props.day} />
      );
    });
    return(
      <div className='workouts-container'>
        <ul className='workouts'>
          {workouts}
        </ul>
        <Permit user={this.props.user} status='sudo'>
          <WorkoutsForm
            user={self.props.user}
            username={self.props.username}
            day={this.props.day} />
        </Permit>
      </div>
    );
  }
});

module.exports = Workouts;
