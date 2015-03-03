'use strict';

var Bacon = require('baconjs');
var Firebase = require('firebase');
var firebaseUrl = 'https://endurance-almaty.firebaseio.com';
var ref = new Firebase(firebaseUrl);
var _ = require('lodash');
var JsSHA = require('jssha');
var Identicon = require('./identicon');

module.exports = {
  // USER AUTHENTICATION
  tryAuth: function(email, password) {
    return Bacon.fromCallback(function(email, password, sink) {
      if (email.length === 0) {
        sink(_.assign(new Error(), { code: 'EMPTY_EMAIL' }));
      }
      if (password.length === 0) {
        sink(_.assign(new Error(), { code: 'EMPTY_PASSWORD' }));
      }
      ref.authWithPassword({ email: email, password: password }, function(error, data) {
        if (error) {
          sink(error);
        } else {
          sink(data);
        }
      });
    }, email, password);
  },
  // CHECK IF USER IS AUTHENTICATED, RETURNS AUTHENTICATION STATE
  getAuth: function() {
    return ref.getAuth();
  },
  // USER LOGOUT
  logout: function() {
    ref.unauth();
  },
  // GET USER'S EMAIL
  getCurrentUserEmail: function() {
    return ref.getAuth().password.email;
  },
  // GET CURRENT USERS'S ID
  getCurrentUserId: function() {
    return ref.getAuth().uid;
  },
  // GENERATES 32x32px USERPIC
  getBase64Userpic: function(text) {
    var textSHA = new JsSHA(text, 'TEXT');
    var hash = textSHA.getHash('SHA-1', 'HEX');
    var data = new Identicon(hash, 32, 4/32).toString();
    return 'data:image/png;base64,' + data;
  },
  // GENERATES 64x64px USERPIC
  getLargeBase64Userpic: function(text) {
    var textSHA = new JsSHA(text, 'TEXT');
    var hash = textSHA.getHash('SHA-1', 'HEX');
    var data = new Identicon(hash, 48, 4/48).toString();
    return 'data:image/png;base64,' + data;
  },
  // GET DAY'S WORKOUTS
  getWorkoutStreamByDay: function(day) {
    var _workoutsRef = ref.child('workouts');
    var _dayWorkoutsRef = ref.child('days').child(day).child('workouts');
    return Bacon.fromBinder(function(sink) {
      _dayWorkoutsRef.on('value', function(snapshot) {
        var workoutsSelection = _.values(snapshot.val());
        _.forEach(workoutsSelection, function(workoutId) {
          _workoutsRef.child(workoutId).on('value', function(workoutSnapshot) {
            sink(_.extend(workoutSnapshot.val(), {key: workoutId}));
          });
        });
      });
    });
    // var _dayWorkouts = ref.child('days/' + day + '/workouts');
  },
  // GET DAY DATA BY ID (id format: DDMMYY)
  // getDayById: function(day) {
  //   var _ref = ref.child('days/'+day);
  //   var _workoutRef = ref.child('workouts');
  //   return Bacon.fromBinder(function(sink) {
  //     _ref.on('value', function(snapshot) {
  //       var day = snapshot.val();
  //       _ref
  //
  //       console.log(snapshot.val(), 'value updated');
  //       sink(snapshot.val());
  //     });
  //   });
  // },
  // APPEND WORKOUT TO A DAY
  setWorkout: function(workout, day) {
    var _dayWorkoutsRef = ref.child('days').child(day).child('workouts');
    var _workoutsRef = ref.child('workouts');
    return Bacon.fromCallback(function(workout, sink){
      var workoutKey =  _dayWorkoutsRef.push(_workoutsRef.push(workout).key()).key();
      sink(workoutKey);
    }, workout);
  },
  getUsernameById: function(userId) {
    var _usernameRef = ref.child('users/'+userId+'/username');
    var username = '';
    _usernameRef.once('value', function(snapshot) {
      console.log(snapshot.val(), 'username snapshot');
      username = snapshot.val();
    });
    return username;
  }
};
