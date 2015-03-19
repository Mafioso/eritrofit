'use strict';

var Icon = require('./Icon.jsx');
var InputTextarea = require('./InputTextarea.jsx');
var CommentStore = require('../stores/CommentStore');
var CommentActions = require('../actions/CommentActions');
var beats = require('../utils/beats');
var Bacon = require('baconjs');
var moment = require('moment');
var _ = require('lodash');

var ENTER_KEY_CODE = 13;

var WorkoutResultSubmit = React.createClass({
  getInitialState: function() {
    return {
      mode: 'DEFAULT', // others are 'ERROR' and 'SUCCESS',
      submitting: false,
      beats: [],
      text: ''
    };
  },
  componentWillMount: function() {
    document.body.className += ' body--stopScroll';
  },
  componentDidMount: function() {
    var self = this;

    this.modalCloseStream = new Bacon.Bus();
    this.throttledModalCloseStream = this.modalCloseStream.throttle(500);

    this.unsubFromThrottledModalCloseStream = this.throttledModalCloseStream.onValue(function(payload) {
      if (payload === Bacon.next) {
        self.props.closeModal();
      }
    });

    this.unsubFromCreateCommentSuccess = CommentStore.streams.createCommentSuccess.onValue(function(payload) {

      if (payload) {

        self.setState({
          mode: 'SUCCESS',
          submitting: true
        });

        // so that next time we'll skip value saved in createCommentSuccess stream
        CommentActions.createCommentSuccess(null);
        self.modalCloseStream.push(Bacon.next);
      }

    });

  },
  componentWillUnmount: function() {
    document.body.className = document.body.className.replace(/\bbody--stopScroll\b/, '');
    if (this.succesTimeout) {
      window.clearTimeout(this.succesTimeout);
    }
    this.modalCloseStream.end();
    this.unsubFromThrottledModalCloseStream();
    this.unsubFromCreateCommentSuccess();
  },
  updateText: function(text) {
    this.setState({
      text: text
    });
  },
  handleKeyUp: function() {
    var newBeats = beats.get(this.state.text);
    if (_.isEqual(this.state.beats, newBeats)) {
    } else {
      this.setState({
        beats: newBeats
      });
    }
  },
  handleKeyDown: function(event) {

    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();

      this.submitResult(event);
    }
  },
  submitResult: function(event) {
    event.preventDefault();

    this.setState({
      submitting: true
    });

    CommentActions.createComment({
      type: 'SUBMISSION',
      text: this.state.text,
      workoutId: this.props.workout.key,
      user: this.props.user,
      timestamp: moment().utc().format()
    });

  },
  render: function() {
    var avgBPM = _.min(this.state.beats);

    var bpm = this.state.beats.length > 0 ? avgBPM : 60;
    var animationConfig = 'heartBeat ' + 60000/bpm + 'ms linear infinite';
    var heartBeat = {
      animation: animationConfig,
      WebkitAnimation: animationConfig,
      MozAnimation: animationConfig,
      OAnimation: animationConfig,
    };
    // FORCE A REFLOW HERE
    var heartBeatNode = <span className='heartBeatAnimationContainer' key={'beats-' + bpm} style={heartBeat}>
      <Icon name='heart' />
    </span>;

    switch(this.state.mode) {
      case 'SUCCESS':
        break;
      default:
        break;
    }

    return (
      <div className='workoutResultSubmit-container'>
        <div onClick={this.props.closeModal} className='workoutResultSubmit-backdrop'></div>
        <form onSubmit={this.submitResult} className='workoutResultSubmit'>
          <div className='workoutResultSubmit-header'>
            <button className='workoutResultSubmit-close' onClick={this.props.closeModal} type='button'>
              <Icon name='x' />
            </button>

            {heartBeatNode}
          </div>
          <div className='workoutResultSubmit-body'>
            <InputTextarea
              disable={this.state.submitting}
              name='workoutSubmitInput'
              autoFocus={true}
              text={this.state.text}
              onTextChange={this.updateText}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
              placeholder='Пульс и результат' />
          </div>
          <div className='workoutResultSubmit-footer'>
            <button disabled={this.state.submitting} className='workoutResultSubmit-submit' type='submit'>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = WorkoutResultSubmit;
