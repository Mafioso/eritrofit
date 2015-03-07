'use strict';

var Icon = require('./Icon.jsx');
var api = require('../utils/api');
var moment = require('moment');

module.exports = React.createClass({
  closeModal: function(event) {
    this.props.handleModalClose(event);
  },
  componentWillMount: function() {
    // add class to body
    document.body.className += ' body--stopScroll';
  },
  componentWillUnmount: function() {
    // remove class from body
    document.body.className = document.body.className.replace(/\bbody--stopScroll\b/, '');
  },
  render: function() {
    var userpic = api.getLargeBase64Userpic(this.props.workout.author);
    var dayTime = new moment(this.props.workout.day, 'DDMMYY');
    var timestampFormat = 'H:mm';
    if (!dayTime.isSame(moment(this.props.workout.timestamp), 'day')) {
      timestampFormat = 'D MMMM H:mm';
    }
    var timestamp = moment(this.props.workout.timestamp).format(timestampFormat);
    if (this.props.workout.editedTimestamp) {
      timestamp += '*';
      timestamp = (
        <span title={'Oтредактировано ' + moment(this.props.workout.editedTimestamp).format('D MMMM в H:mm')}>
          {timestamp}
        </span>
      );
    }
    if (!this.props.selectedWorkoutExists) {
      return (
        <div className='modal-body workoutDetails-container'>
          <button onClick={this.closeModal} className='workoutDetails-close' type='button'>
            <Icon name='x' />
          </button>
          <div className='workoutDetails'>
            <div className='workoutDetails-error'>
              Этот комплекс был удален.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='modal-body workoutDetails-container'>
        <button onClick={this.closeModal} className='workoutDetails-close' type='button'>
          <Icon name='x' />
        </button>
        <div className='workoutDetails'>
          <div className='workoutDetails-header'>
            <div className='workout-userpic figure-userpic'>
              <img src={userpic} />
            </div>
            <div className='workout'>
              <div className='workout-meta'>
                <div className='workout-meta-body'>
                  <strong className='workout-meta-user'>{this.props.workout.username}</strong>, {timestamp}
                </div>
              </div>
              <div className='workout-body'>
                {this.props.workout.text}
              </div>
            </div>
          </div>
          <div className='workoutDetails-body'>
            <div className='workoutDetails-comment'>
              <div className='workoutDetails-comment-userpic figure-userpic'>
                <img src={userpic} />
              </div>
              <div className='workoutDetails-comment-body'>
                <div className='workoutDetails-comment-meta'>
                  <strong className='workout-meta-user'>{this.props.workout.username}</strong>, {timestamp}
                </div>
                <div className='workoutDetails-comment-entry'>
                  rtalalalalala alalalala
                </div>
              </div>
            </div>
          </div>
          <div className='workoutDetails-footer'>
            Ввод комментов или аплоад результатов
          </div>
        </div>
      </div>
    );
  }
});
