'use strict';

var flux = require('fluxstream');
var DayActions = require('../actions/DayActions');
var api = require('../utils/api');
var moment = require('moment');
var _ = require('lodash');

module.exports = flux.createStore({
  init: function() {
    DayActions.getDay.listen(function(payload) {
      var workoutStreamByDay = api.getWorkoutStreamByDay(payload.day);
      workoutStreamByDay.onValue(function(payload) {
        console.log(payload, 'update workouts list');
      });
      // var fetchDayWorkouts = api.getWorkoutsByDay(payload.day);
      // fetchDayWorkouts.onValue(function(payload) {
      //   console.log(payload, 'payload');
      // });
      // var day = payload.day;
      // var fetchDayData = api.getDayById(day);
      // fetchDayData.onValue(function(payload) {
      //   // payload contains workouts
      //   var workouts = [];
      //   // extend payload with user info
      //   if (payload && payload.workouts) {
      //     _.forEach(_.keys(payload.workouts), function(key) {
      //       var username = api.getUsernameById(payload.workouts[key].author);
      //       workouts.push(_.extend(payload.workouts[key], {key: key, username: username}));
      //     });
      //   }
      //   DayActions.setDay({ workouts: workouts });
      // });
    });
    DayActions.createWorkout.listen(function(payload) {
      // payload consists of workout instructions (text) and day
      // what info workout should have?
      // 1. local timestamp, assume it's correct
      // 2. author id
      // 3. text
      // 4. day
      var timestamp = moment().utc().format();
      var authorId = api.getCurrentUserId();
      if (timestamp && authorId && payload.text && payload.day) {
        var setWorkout = api.setWorkout({
          timestamp: timestamp,
          author: authorId,
          text: payload.text
        }, payload.day);
        setWorkout.onValue(function(payload) {
          DayActions.createWorkoutSuccess(payload);
        });
      }
    });
  },
  config: {
    errors: {
      action: DayActions.setFetchError
    },
    setDay: {
      action: DayActions.setDay
    },
    createWorkoutSuccess: {
      action: DayActions.createWorkoutSuccess
    }
  }
});
