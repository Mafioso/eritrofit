'use strict';

var Nav = require('../components/Nav.jsx');
var Scroller = require('../components/Scroller.jsx');
var WeekScroller = require('../components/WeekScroller.jsx');
var Workouts = require('../components/Workouts.jsx');
var Portal = require('../components/Portal.jsx');
var WorkoutDetails = require('../components/WorkoutDetails.jsx');
var TimeoutTransitionGroup = require('../components/TimeoutTransitionGroup.jsx');
var DayActions = require('../actions/DayActions');
var DayStore = require('../stores/DayStore');
// var moment = require('moment');
var _ = require('lodash');

var Day = React.createClass({
  getInitialState: function() {
    return({
      workouts: {},
      selectedWorkout: {},
      showWorkoutDetails: false,
      selectedWorkoutExists: true,
      unsubscribe: {}
    });
  },
  componentDidMount: function() {
    // CREATE A LISTENER FOR A NEW DAY DATA
    var self = this;
    var unsubscribe = DayStore.streams.workoutsStream.onValue(function(payload) {
      // every time workout changes we decide whether to set selectedWorkoutExists to true or not
      var workouts;
      if (self.isMounted() && payload && payload.action) {
        switch (payload.action) {
          case 'REMOVE':
            workouts = self.state.workouts;
            delete workouts[payload.key];
            var selectedWorkoutExists = self.state.selectedWorkoutExists;
            if (self.state.selectedWorkout.key === payload.key) {
              selectedWorkoutExists = false;
            }
            self.setState({
              workouts: workouts,
              selectedWorkoutExists: selectedWorkoutExists
            });
            break;
          case 'PUT':
            workouts = self.state.workouts;
            workouts[payload.key] = payload;
            var selectedWorkout = {};
            if (self.state.selectedWorkout.key === payload.key) {
              // update workoutDetails prop
              selectedWorkout = _.extend(payload, {day: self.props.params.day});
              self.setState({ selectedWorkout: selectedWorkout });
            }
            self.setState({workouts: workouts});
            break;
          default:
            break;
        }
      }
    });
    this.setState({ workouts: {}, unsubscribe: unsubscribe });
    // FIRST TIME
    DayActions.setupDayStreams({ day: this.props.params.day });
  },
  componentWillReceiveProps: function(nextProps) {
    // EMPTY CURRENT STATE
    this.setState({ workouts: {} }, function() {
      // UPDATE DAY DATA STREAMS WITH THE NEW DAY
      DayActions.setupDayStreams({ day: nextProps.params.day });
    });
  },
  componentWillUnmount: function() {
    this.state.unsubscribe();
  },
  hideWorkoutDetails: function() {
    this.setState({
      showWorkoutDetails: false
    });
  },
  handleShowWorkoutDetails: function(workout) {
    this.setState({ selectedWorkout: workout, showWorkoutDetails: true, selectedWorkoutExists: true });
  },
  render: function() {
    // don't mount workout details, if showWorkoutDetails is false
    var workoutDetailsBackdrop;
    var workoutDetails;
    if (this.state.showWorkoutDetails && this.state.selectedWorkout) {
      workoutDetailsBackdrop = (
        <div
          key='modal-backrop'
          onClick={this.hideWorkoutDetails}
          className='modal-backdrop workoutDetails-backdrop' />
      );
      workoutDetails = (
        <WorkoutDetails
          key={this.state.selectedWorkout.key}
          workout={this.state.selectedWorkout}
          handleModalClose={this.hideWorkoutDetails}
          selectedWorkoutExists={this.state.selectedWorkoutExists} />
      );
    }
    return (
      <div>
        <Nav
          user={this.props.user}
          username={this.props.username} />
        <WeekScroller
          day={this.props.params.day} />
        <Scroller
          day={this.props.params.day} />
        <Workouts
          onShowWorkoutDetails={this.handleShowWorkoutDetails}
          user={this.props.user}
          username={this.props.username}
          items={this.state.workouts}
          day={this.props.params.day} />
        <Portal>
          <TimeoutTransitionGroup enterTimeout={150} leaveTimeout={150} component='div' transitionName='workoutDetailsBackdropTransition'>
            {workoutDetailsBackdrop}
          </TimeoutTransitionGroup>
          <TimeoutTransitionGroup enterTimeout={250} leaveTimeout={100} component='div' transitionName='workoutDetailsTransition'>
            {workoutDetails}
          </TimeoutTransitionGroup>
        </Portal>
      </div>
    );
  }
});

module.exports = Day;
