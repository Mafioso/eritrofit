'use strict';

var Nav = require('../components/Nav.jsx');
var Scroller = require('../components/Scroller.jsx');
var WeekScroller = require('../components/WeekScroller.jsx');
var Workouts = require('../components/Workouts.jsx');
var Portal = require('../components/Portal.jsx');
var WorkoutDetails = require('../components/WorkoutDetails.jsx');
var WorkoutResultSubmit = require('../components/WorkoutResultSubmit.jsx');
var TimeoutTransitionGroup = require('../components/TimeoutTransitionGroup.jsx');
var DayActions = require('../actions/DayActions');
var DayStore = require('../stores/DayStore');
// var moment = require('moment');
var _ = require('lodash');

var Day = React.createClass({
  getInitialState: function() {
    return({
      mode: '',
      workouts: {},
      selectedWorkout: {},
      showWorkoutDetails: false,
      selectedWorkoutExists: true
    });
  },
  componentDidMount: function() {
    // CREATE A LISTENER FOR A NEW DAY DATA
    var self = this;
    this.unsubFromWorkoutsStream = DayStore.streams.workoutsStream.onValue(function(payload) {
      // every time workout changes we decide whether to set selectedWorkoutExists to true or not
      var workouts;
      if (payload && payload.action) {
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
    this.setState({ workouts: {} });
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
    this.unsubFromWorkoutsStream();
  },
  hideModal: function() {
    this.setState({
      mode: ''
    });
  },
  showWorkoutDetails: function(workout) {
    this.setState({ selectedWorkout: workout, mode: 'DETAIL', selectedWorkoutExists: true });
  },
  showSubmit: function(workout) {
    this.setState({ selectedWorkout: workout, mode: 'SUBMIT', selectedWorkoutExists: true });
  },
  render: function() {

    var detailPortal = {
      backdrop: null,
      modal: null
    };

    var submitPortal = {
      backdrop: null,
      modal: null
    };

    switch (this.state.mode) {
      case 'DETAIL':
        detailPortal.backdrop = <div
          key='modal-backrop'
          onClick={this.hideModal}
          className='modal-backdrop workoutDetails-backdrop' />;
        detailPortal.modal = <WorkoutDetails
          user={this.props.user}
          key={this.state.selectedWorkout.key}
          workout={this.state.selectedWorkout}
          closeModal={this.hideModal}
          selectedWorkoutExists={this.state.selectedWorkoutExists} />;
        break;
      case 'SUBMIT':
        submitPortal.backdrop = <div
          key='modal-backrop'
          onClick={this.hideModal}
          className='modal-backdrop workoutResultSubmit-backdrop' />;
        submitPortal.modal = <WorkoutResultSubmit
          user={this.props.user}
          key={this.state.selectedWorkout.key}
          workout={this.state.selectedWorkout}
          closeModal={this.hideModal} />;
        break;
      default:
        detailPortal = {
          backdrop: null,
          modal: null
        };

        submitPortal = {
          backdrop: null,
          modal: null
        };
        break;
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
          showSubmit={this.showSubmit}
          showWorkoutDetails={this.showWorkoutDetails}
          user={this.props.user}
          username={this.props.username}
          items={this.state.workouts}
          day={this.props.params.day} />
          <Portal>
            <TimeoutTransitionGroup enterTimeout={100} leaveTimeout={150} component='div' transitionName='workoutDetailsBackdropTransition'>
              {detailPortal.backdrop}
            </TimeoutTransitionGroup>
            <TimeoutTransitionGroup enterTimeout={150} leaveTimeout={100} component='div' transitionName='workoutDetailsTransition'>
              {detailPortal.modal}
            </TimeoutTransitionGroup>
          </Portal>
          <Portal>
            <TimeoutTransitionGroup enterTimeout={100} leaveTimeout={150} component='div' transitionName='workoutResultSubmitBackdropTransition'>
              {submitPortal.backdrop}
            </TimeoutTransitionGroup>
            <TimeoutTransitionGroup enterTimeout={150} leaveTimeout={100} component='div' transitionName='workoutResultSubmitTransition'>
              {submitPortal.modal}
            </TimeoutTransitionGroup>
          </Portal>
      </div>
    );
  }
});

module.exports = Day;
