'use strict';

var api = require('../utils/api');
var moment = require('moment');
var Permit = require('./Permit.jsx');
var Icon = require('./Icon.jsx');
var InputTextarea = require('./InputTextarea.jsx');
var DayActions = require('../actions/DayActions');
var DayStore = require('../stores/DayStore');
var classNames = require('classnames');
var _ = require('lodash');

var WorkoutsItem = React.createClass({
  propTypes: {
    day: React.PropTypes.string,
    user: React.PropTypes.string,
    workout: React.PropTypes.object,
    showWorkoutDetails: React.PropTypes.func,
    showSubmit: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      mode: 'DEFAULT', // others are 'UPDATE' and 'DELETE'
      newText: '', // new workout description
      isUpdating: false, // in process of update (true when submitting update or delete)
    };
  },
  componentWillMount: function() {
    var self = this;
    // listen to successful updates and reset view configuration
    this.unsubFromUpdateWorkoutSuccess = DayStore.streams.updateWorkoutSuccess.listen(function() {
      self.setState({
        mode: 'DEFAULT',
        newText: '',
        isUpdating: false
      });
    });
  },
  componentWillUnmount: function() {
    this.unsubFromUpdateWorkoutSuccess();
  },
  render: function() {

    var timestamp = this.formatEditedTimestamp(this.props.workout.timestamp, this.props.workout.editedTimestamp, this.props.day);

    var workoutsItemBody;

    switch (this.state.mode) {
      case 'DEFAULT':
        workoutsItemBody = (
          <div className='workout'>
            <div className='workout'>
              <div className='workout-meta'>
                <div className='workout-meta-body'>
                  <strong className='workout-meta-user'>{this.props.workout.username}</strong> {timestamp}
                </div>
                <div className='workout-meta-controls'>
                  <Permit validate={this.hasEditPermission}>
                    <button
                      onClick={this.setModeUpdate}
                      className='workout-meta-controls-btn'
                      type='button'>
                      <Icon name='edit' />
                    </button>
                  </Permit>
                  <button onClick={this.showWorkoutDetails} className='workout-meta-controls-btn' type='button'>
                    <Icon name='chat' />
                    {_.values(this.props.workout.comments).length}
                  </button>
                </div>
              </div>
              <div className='workout-body'>
                <div className='workout-text'>
                  {this.props.workout.text}
                </div>
              </div>
              <div className='workout-footer'>
                <button onClick={this.showSubmit} className='workout-submit' type='button'>
                  <span className='workout-submit-label'>
                    Загрузить результат
                  </span>
                  <span className='workout-submit-counter'>
                    {_.values(this.props.workout.submissions).length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
        break;
      case 'UPDATE':
        workoutsItemBody = (
          <form onSubmit={this.updateWorkout} className='workout'>
            <div className='workout-meta'>
              <div className='workout-meta-body'>
                <strong className='workout-meta-user'>{this.props.workout.username}</strong> { timestamp }
              </div>
              <div className='workout-meta-controls'>
                <button
                  className='workout-meta-controls-btn'
                  onClick={this.setModeDefault}
                  type='button'>
                  Отмена
                </button>
              </div>
            </div>
            <div className='workout-body'>
              <InputTextarea
                name={'update'+this.props.workout.key}
                autoFocus={true}
                text={this.state.newText}
                onTextChange={this.updateNewText}
                placeholder='Введите инструкции' />
            </div>
            <div className='workout-footer'>
              <button
                onClick={this.setModeDelete}
                className='workout-button'
                type='button'
                disabled={this.state.isUpdating}>
                Удалить
              </button>
              <button
                className='workout-submit'
                type='submit'
                disabled={this.state.isUpdating}>
                Сохранить
              </button>
            </div>
          </form>
        );
        break;
      case 'DELETE':
        workoutsItemBody = (
          <form onSubmit={this.updateWorkout} className='workout'>
            <div className='workout-meta'>
              <div className='workout-meta-body'>
                <strong className='workout-meta-user'>{this.props.workout.username}</strong> { timestamp }
              </div>
              <div className='workout-meta-controls'>
                <button
                  className='workout-meta-controls-btn'
                  onClick={this.setModeDefault}
                  type='button'>
                  Отмена
                </button>
              </div>
            </div>
            <div className='workout-body'>
              <InputTextarea
                name={'update'+this.props.workout.key}
                autoFocus={true}
                text={this.state.newText}
                onTextChange={this.updateNewText}
                placeholder='Введите инструкции' />
            </div>
            <div className='workout-footer'>
              <button
                onClick={this.deleteWorkout}
                className='workout-delete'
                type='button'>
                Да
              </button>
              <button
                onClick={this.setModeUpdate}
                className='workout-button'
                type='button'>
                Нет
              </button>
            </div>
          </form>
        );
        break;
      default:
        break;
    }

    var cs = classNames('workouts-item', 'workouts-item-'+this.state.mode);

    return (
      <li className={cs}>
        <div className='workout-userpic figure-userpic'>
          <img src={api.getLargeBase64Userpic(this.props.workout.author)} />
        </div>
        {workoutsItemBody}
      </li>
    );

  },
  formatTimestamp: function(timestamp, day) {
    var dayMoment = new moment(day, 'DDMMYY');

    if (dayMoment.isSame(moment(timestamp), 'day')) {
      return moment(timestamp).format('H:mm');
    } else {
      return moment(timestamp).format('D MMMM H:mm');
    }
  },
  formatEditedTimestamp: function(timestamp, editedTimestamp, day) {
    var formattedTimestamp = this.formatTimestamp(timestamp, day);
    if (editedTimestamp) {
      formattedTimestamp += '*';
      return (<span title={'Oтредактировано ' + moment(editedTimestamp).format('D MMMM в H:mm')}>
        {formattedTimestamp}
      </span>);
    } else {
      return formattedTimestamp;
    }
  },
  hasEditPermission: function() {
    return this.props.workout.author === this.props.user;
  },
  setModeDefault: function(event){
    event.preventDefault();
    this.setState({
      mode: 'DEFAULT',
      isUpdating: false
    });
  },
  setModeUpdate: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'UPDATE',
      newText: this.props.workout.text,
      isUpdating: false
    });
  },
  setModeDelete: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'DELETE',
      isUpdating: false
    });
  },
  updateNewText: function(text) {
    this.setState({
      newText: text
    });
  },
  showWorkoutDetails: function() {
    this.props.showWorkoutDetails(_.extend(this.props.workout, {
      day: this.props.day
    }));
  },
  showSubmit: function() {
    this.props.showSubmit(_.extend(this.props.workout, {
      day: this.props.day
    }));
  },
  updateWorkout: function(event) {
    console.log('UPDATE WORKOUT!');
    event.preventDefault();
    var config = {
      text: this.state.newText,
      editedTimestamp: moment().utc().format(),
      key: this.props.workout.key
    };
    DayActions.updateWorkout(config);
    this.setState({
      isUpdating: true
    });
  },
  deleteWorkout: function() {
    this.setState({
      mode: 'DEFAULT'
    });
    var config = {
      day: this.props.day,
      key: this.props.workout.key
    };
    DayActions.deleteWorkout(config);
  }
});

module.exports = WorkoutsItem;
