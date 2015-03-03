'use strict';

var WorkoutsForm = require('./workoutsForm.jsx');
var WorkoutsItem = require('./workoutsItem.jsx');
var Permit = require('./permit.jsx');
var DayActions = require('../actions/DayActions');
var DayStore = require('../stores/DayStore');
var _ = require('lodash');

module.exports = React.createClass({
  getInitialState: function() {
    return ({
      showForm: false
    });
  },
  componentDidMount: function() {
    DayStore.streams.createWorkoutSuccess.listen(function(payload) {
      console.log(payload, 'create workout success');
    });
  },
  handleWorkoutSubmit: function(text) {
    // var workouts = this.state.workouts;
    // workouts.push(workout);
    // this.setState({
    //   workouts: workouts,
    //   showForm: false
    // });
    DayActions.createWorkout({
      text: text,
      day: this.props.dayId
    });
  },
  render: function() {
    var nextWorkoutIdx = 1;
    var workouts = [];
    var workoutItems;
    console.log(this.props.dayData);
    // if (this.props.dayData) {
    //   workouts = _.values(this.props.dayData.workouts);
    //   nextWorkoutIdx = workouts.length + 1;
    // }
    //
    // _.map(workouts, function(workout) {
    //   return
    // });

    return(
      <div className='workouts-container'>
        <Permit userId='userid' requiredStatus='sudo'>
          <WorkoutsForm
            showForm={this.state.showForm}
            idx={nextWorkoutIdx}
            onWorkoutSubmit={this.handleWorkoutSubmit} />
        </Permit>
      </div>
    );
  }
});
