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

var Day = React.createClass({
  getInitialState: function() {
    return({
      workouts: {},
      showWorkoutDetails: true,
      unsubscribe: {}
    });
  },
  componentDidMount: function() {
    // CREATE A LISTENER FOR A NEW DAY DATA
    var self = this;
    var unsubscribe = DayStore.streams.workoutsStream.onValue(function(payload) {
      var workouts;
      if (self.isMounted() && payload && payload.action) {
        switch (payload.action) {
          case 'REMOVE':
            workouts = self.state.workouts;
            delete workouts[payload.key];
            self.setState({ workouts: workouts });
            break;
          case 'PUT':
            workouts = self.state.workouts;
            workouts[payload.key] = payload;
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
  render: function() {
    var cs = React.addons.classSet;
    var modalClasses = cs({
      'modal': true,
      'modal--open': true
    });
    // don't mount workout details, if showWorkoutDetails is false
    var workoutDetailsBackdrop;
    var workoutDetails;
    if (this.state.showWorkoutDetails) {
      workoutDetailsBackdrop = (
        <div
          key='modal-backrop'
          onClick={this.hideWorkoutDetails}
          className='modal-backdrop workoutDetails-backdrop' />
      );
      workoutDetails = (
        <WorkoutDetails
          key='somekey'
          handleModalClose={this.hideWorkoutDetails} />
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
          user={this.props.user}
          username={this.props.username}
          items={this.state.workouts}
          day={this.props.params.day} />
        <Portal>
          <TimeoutTransitionGroup enterTimeout={300} leaveTimeout={300} component='div' transitionName='workoutDetailsBackdropTransition'>
            {workoutDetailsBackdrop}
          </TimeoutTransitionGroup>
          <TimeoutTransitionGroup enterTimeout={150} leaveTimeout={150} component='div' transitionName='workoutDetailsTransition'>
            {workoutDetails}
          </TimeoutTransitionGroup>
        </Portal>
      </div>
    );
  }
});

module.exports = Day;
