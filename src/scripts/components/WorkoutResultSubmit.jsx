'use strict';

var Icon = require('./Icon.jsx');
var InputTextarea = require('./InputTextarea.jsx');
var _ = require('lodash');

var ENTER_KEY_CODE = 13;

var WorkoutResultSubmit = React.createClass({
  getInitialState: function() {
    return {
      mode: 'DEFAULT', // others are 'ERROR' and 'SUCCESS',
      beats: [],
      text: ''
    };
  },
  componentWillMount: function() {
    document.body.className += ' body--stopScroll';
  },
  componentWillUnmount: function() {
    document.body.className = document.body.className.replace(/\bbody--stopScroll\b/, '');
  },
  updateText: function(text) {
    this.setState({
      text: text
    });
  },
  handleKeyUp: function() {
    var newBeats = this.getBeats(this.state.text);
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

      // this.submitResult(event);
    }
  },
  getBeats: function(text) {
    function isHeartRate(rate) {
      // allowed range for pulse is 40 to 300
      if (rate >= 40 && rate <= 300) {
        return true;
      }
      return false;
    }
    var wordsWithDigits = _.words(text, /\S*\d+\S*/g);
    var candidates = []; // contains all the canidates that can become a heart rate

    _.forEach(wordsWithDigits, function(word) {
      var subWords = _.words(word, /\d+/g);
      var candidate = {
        beats: []
      };

      if (subWords.length < 3) {
        _.forEach(subWords, function(subWord) {
          candidate.beats.push(parseInt(subWord, 10));
        });
      }
      // validate candidate.beats
      if (_.reduce(candidate.beats, function(result, value) {
        return result && isHeartRate(value);
      }, true)) {
        candidates.push(candidate);
      }
    });

    var result = [];

    if (candidates[0]) {
      if (candidates[0].beats.length === 1) {
        result.push(candidates[0].beats[0]);
        if (candidates[1] && candidates[1].beats.length === 1) {
          result.push(candidates[1].beats[0]);
        } else if (candidates[1]) {
          result = candidates[1].beats;
        }
      } else {
        result = candidates[0].beats;
      }
    }
    return result;
  },
  submitResult: function(event) {
    event.preventDefault();
    // test string 140max 120avg saldfkjsadf dslfj1 dkfj 1 123.123 123/123 124214.2 21421,212

  },
  render: function() {
    // var bpm = this.state.avgHeartBeat > 0 ? this.state.avgHeartBeat : this.state.defaultBeat;
    var bpm = this.state.beats.length > 0 ? _.min(this.state.beats) : 60;

    console.log(bpm);

    var animationConfig = 'heartBeat ' + 60000/bpm + 'ms linear infinite';
    var heartBeat = {
      animation: animationConfig,
      WebkitAnimation: animationConfig,
      MozAnimation: animationConfig,
      OAnimation: animationConfig,
    };
    // FORCE A REFLOW HERE
    var heartBeatNode = <span className='heartBeatAnimationContainer' key={'heartBeat-' + bpm} style={heartBeat}>
      <Icon name='heart' />
    </span>;
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
              name='workoutSubmitInput'
              autoFocus={true}
              text={this.state.text}
              onTextChange={this.updateText}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
              placeholder='Пульс и результат' />
          </div>
          <div className='workoutResultSubmit-footer'>
            <button className='workoutResultSubmit-submit' type='submit'>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = WorkoutResultSubmit;
