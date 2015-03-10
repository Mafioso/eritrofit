'use strict';

var moment = require('moment');
var _ = require('lodash');
var api = require('../utils/api');

var WorkoutDetailsHeader = React.createClass({
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

    var text = this.props.workout.text;
    var split = text.split(/(\r\n|\n|\r)/gm);
    var removedLines = false;

    if (Math.ceil(split.length / 2) > 3) {
      removedLines = true;
      text = '';
      for (var i = 0; i < 5; i++) {
        text += split[i];
      }
    }

    text = _.trunc(text, {
      'length': 140,
      'separator': /,? +/,
    });

    if (removedLines && !_.endsWith(text, '...')) {
      text += '...';
    }
    return (
      <div className='workoutDetails-header'>
        <div className='workout-userpic figure-userpic'>
          <img src={userpic} />
        </div>
        <div className='workout'>
          <div className='workout-meta'>
            <div className='workout-meta-body'>
              <strong className='workout-meta-user'>{this.props.workout.username}</strong> {timestamp}
            </div>
          </div>
          <div className='workout-body'>
            {text}
          </div>
        </div>
      </div>
    );

  }
});

module.exports = WorkoutDetailsHeader;
