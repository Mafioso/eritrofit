'use strict';

var api = require('../utils/api');
var moment = require('moment');
var Icon = require('./icon.jsx');
var InputTextarea = require('./InputTextarea.jsx');
var DayActions = require('../actions/DayActions');
var DayStore = require('../stores/DayStore');
var _ = require('lodash');

var WorkoutsItem = React.createClass({
  // PROPS:
  // author
  // timestamp
  // username
  // workoutIndex
  // text
  // submissions
  // onWorkoutSubmit
  getInitialState: function() {
    return {
      showForm: false,
      editingText: '',
      submittingUpdate: false,
      removing: false,
      updateWorkoutSuccessUnsub: {},
      goingToDelete: false
    };
  },
  componentWillMount: function() {
    var self = this;
    var updateWorkoutSuccessUnsub = DayStore.streams.updateWorkoutSuccess.listen(function() {
      if (self.isMounted()) {
        self.setState({
          showForm: false,
          editingText: '',
          submittingUpdate: false
        });
      }
    });
    this.setState({
      updateWorkoutSuccessUnsub: updateWorkoutSuccessUnsub
    });
  },
  handleWorkoutResultSubmit: function() {

  },
  handleShowWorkoutDetails: function() {
    this.props.onShowWorkoutDetails(_.extend(this.props.workout, {
      day: this.props.day
    }));
  },
  turnOnGoingToDelete: function() {
    this.setState({
      goingToDelete: true
    });
  },
  handleWorkoutDelete: function() {
    this.setState({
      removing: true,
      goingToDelete: false
    });
    var config = {
      day: this.props.day,
      key: this.props.workout.key
    };
    DayActions.deleteWorkout(config);
  },
  handleWorkoutUpdate: function(event) {
    event.preventDefault();
    var config = {
      text: this.state.editingText,
      editedTimestamp: moment().utc().format(),
      key: this.props.workout.key
    };
    DayActions.updateWorkout(config);
    this.setState({
      submittingUpdate: true
    });
  },
  handleWorkoutEdit: function() {
    this.setState({
      showForm: !this.state.showForm,
      editingText: !this.state.showForm ? this.props.workout.text : '',
      goingToDelete: false
    });
  },
  handleEditingWorkoutTextUpdate: function(text) {
    this.setState({
      editingText: text
    });
  },
  componentWillUnmount: function() {
    this.state.updateWorkoutSuccessUnsub();
  },
  render: function() {
    var userpic = api.getLargeBase64Userpic(this.props.workout.author);
    var dayTime = new moment(this.props.day, 'DDMMYY');
    var timestampFormat = 'H:mm';
    if (!dayTime.isSame(moment(this.props.workout.timestamp), 'day')) {
      timestampFormat = 'D MMMM H:mm';
    }
    var timestamp = moment(this.props.workout.timestamp).format(timestampFormat);

    var editButton;
    if (this.props.workout.author === this.props.user) {
      editButton = (
        <button
          onClick={this.handleWorkoutEdit}
          className='workout-meta-controls-btn'
          type='button'>
          <Icon name='edit' />
        </button>
      );
    }
    if (this.props.workout.editedTimestamp) {
      timestamp += '*';
      timestamp = (
        <span title={'Oтредактировано ' + moment(this.props.workout.editedTimestamp).format('D MMMM в H:mm')}>
          {timestamp}
        </span>
      );
    }

    if (this.state.showForm) {
      var deleteButton =  <button
                            onClick={this.turnOnGoingToDelete}
                            className='workout-preDelete'
                            type='button'>
                            <Icon name='trash' />
                          </button>;
      if (this.state.goingToDelete) {
        deleteButton =  <button
                          onClick={this.handleWorkoutDelete}
                          className='workout-delete'
                          type='button'
                          disabled={this.state.removing}>
                          Да?
                        </button>;
      }

      return (
        <li className='workouts-item'>
          <div className='workout-userpic figure-userpic'>
            <img src={userpic} />
          </div>
          <form onSubmit={this.handleWorkoutUpdate} className='workout'>
            <div className='workout-meta'>
              <div className='workout-meta-body'>
                <strong className='workout-meta-user'>{this.props.workout.username}</strong> { timestamp }
              </div>
              <div className='workout-meta-controls'>
                <button
                  className='workout-meta-controls-btn'
                  onClick={this.handleWorkoutEdit}
                  type='button'>
                  Отмена
                </button>
              </div>
            </div>
            <div className='workout-body'>
              <InputTextarea
                name={'workout_text_'+this.props.workout.key}
                autoFocus={true}
                text={this.state.editingText}
                onTextChange={this.handleEditingWorkoutTextUpdate}
                placeholder='Введите инструкции' />
            </div>
            <div className='workout-footer'>
              {deleteButton}
              <button
                className='workout-submit'
                type='submit'
                disabled={this.state.submittingUpdate}>
                Сохранить изменения
              </button>
            </div>
          </form>
        </li>
      );
    } else {

      return (
        <li className='workouts-item'>
          <div className='workout-userpic figure-userpic'>
            <img src={userpic} />
          </div>
          <div className='workout'>
            <div className='workout-meta'>
              <div className='workout-meta-body'>
                <strong className='workout-meta-user'>{this.props.workout.username}</strong> {timestamp}
              </div>
              <div className='workout-meta-controls'>
                {editButton}
                <button onClick={this.handleShowWorkoutDetails} className='workout-meta-controls-btn' type='button'>
                  <Icon name='chat' />
                  {_.values(this.props.workout.comments).length}
                </button>
              </div>
            </div>
            <div className='workout-body'>
              {this.props.workout.text}
            </div>
            <div className='workout-footer'>
              <button onClick={this.handleWorkoutResultSubmit} className='workout-submit' type='button'>
                <span className='workout-submit-label'>
                  Загрузить результат
                </span>
                <span className='workout-submit-counter'>
                  0
                </span>
              </button>
            </div>
          </div>
        </li>
      );
    }
  }
});

module.exports = WorkoutsItem;
