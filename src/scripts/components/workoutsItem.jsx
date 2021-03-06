'use strict';

var api = require('../utils/api');
var moment = require('moment');

module.exports = React.createClass({
  // PROPS:
  // author
  // timestamp
  // username
  // workoutIndex
  // text
  // submissions
  // onWorkoutSubmit
  handleWorkoutSubmit: function() {

  },
  render: function() {
    var userpic = api.getLargeBase64Userpic(this.props.author);
    var timestamp = moment(this.props.timestamp).format('H:mm');
    return (
      <li className='workouts-item'>
        <div className='workout-userpic figure-userpic'>
          <img src={userpic} />
        </div>
        <div className='workout'>
          <div className='workout-meta'>
            <strong className='workout-meta-user'>{this.props.username}</strong>, { timestamp }
          </div>
          <div className='workout-heading'>Комплекс {this.props.workoutIndex}.</div>
          <div className='workout-body'>
            {this.props.text}
          </div>
          <div className='workout-footer'>
            <span className='workout-footer-item'>0 (загруженные результаты)</span>
            <button onClick={this.handleWorkoutSubmit} className='workout-submit' type='button'>Загрузить результат</button>
          </div>
        </div>
      </li>
    );
  }
});
