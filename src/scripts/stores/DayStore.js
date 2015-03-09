'use strict';

var flux = require('fluxstream');
var DayActions = require('../actions/DayActions');
var api = require('../utils/api');
var _ = require('lodash');

module.exports = flux.createStore({
  init: function() {
    var refs = [];
    DayActions.setupDayStreams.listen(function(payload) {
      // release the callbacks!
      _.forEach(refs, function(ref) {
        ref.off();
      });
      refs = [];

      if (payload) {
        var workoutsRef = api.ref.child('days').child(payload.day).child('workouts');
        refs.push(workoutsRef);

        workoutsRef.on('child_removed', function(removedWorkoutSnap) {
          DayActions.workoutsStream({ action: 'REMOVE', key: removedWorkoutSnap.val() });
        });

        workoutsRef.on('child_added', function(workoutSnap) {
          var workoutId = workoutSnap.val();
          var workoutRef = api.ref.child('workouts').child(workoutId);
          refs.push(workoutRef);

          workoutRef.on('value', function(workoutSnap) {
            var workout = workoutSnap.val();

            if (workout) {
              var userId = workout.author;
              var userRef = api.ref.child('users').child(userId);

              refs.push(userRef);

              userRef.on('value', function(userSnap) {
                var profile = userSnap.val();

                var workoutPayload = _.extend(workout, {
                  action: 'PUT',
                  key: workoutRef.key(),
                  username: profile.username
                });
                DayActions.workoutsStream(workoutPayload);
              });
            }
          });
        });
      }
    });

    DayActions.updateWorkout.listen(function(payload) {
      var updateWorkoutStream = api.updateWorkout(payload);
      updateWorkoutStream.onValue(function(payload) {
        if (payload === 'success') {
          DayActions.updateWorkoutSuccess(payload);
        }
      });
    });
    DayActions.deleteWorkout.listen(function(payload) {
      var deleteWorkoutStream = api.deleteWorkout(payload);
      deleteWorkoutStream.onValue(function(payload) {
        DayActions.deleteWorkoutSuccess(payload);
      });
    });
    DayActions.createWorkout.listen(function(payload) {
      // payload consists of workout instructions (text) and day
      // what info workout should have?
      // 1. local timestamp, assume it's correct
      // 2. author id
      // 3. text
      // 4. day
      if (payload.timestamp && payload.user && payload.text && payload.day) {
        var createWorkout = api.createWorkout({
          timestamp: payload.timestamp,
          author: payload.user,
          text: payload.text
        }, payload.day);
        createWorkout.onValue(function(payload) {
          DayActions.createWorkoutSuccess(payload);
        });
      }
    });
  },
  config: {
    workoutsStream: {
      action: DayActions.workoutsStream
    },
    createWorkoutSuccess: {
      action: DayActions.createWorkoutSuccess
    },
    updateWorkoutSuccess: {
      action: DayActions.updateWorkoutSuccess
    },
    deleteWorkoutSuccess: {
      action: DayActions.deleteWorkoutSuccess
    }
  }
});
