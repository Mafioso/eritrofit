'use strict';

var api = require('../utils/api');
var moment = require('moment');
var Icon = require('./icon.jsx');
var InputTextarea = require('./InputTextarea.jsx');
var DayActions = require('../actions/DayActions');
var DayStore = require('../stores/DayStore');

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
      updateWorkoutSuccessUnsub: {}
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
  handleWorkoutDelete: function() {
    this.setState({
      removing: true
    });
    var config = {
      day: this.props.day,
      key: this.props.workoutId
    };
    DayActions.deleteWorkout(config);
  },
  handleWorkoutUpdate: function(event) {
    event.preventDefault();
    var config = {
      text: this.state.editingText,
      editedTimestamp: moment().utc().format(),
      key: this.props.workoutId
    };
    DayActions.updateWorkout(config);
    this.setState({
      submittingUpdate: true
    });
  },
  handleWorkoutEdit: function() {
    this.setState({
      showForm: !this.state.showForm,
      editingText: !this.state.showForm ? this.props.text : ''
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
    var userpic = api.getLargeBase64Userpic(this.props.author);
    var dayTime = new moment(this.props.day, 'DDMMYY');
    var timestampFormat = 'H:mm';
    if (!dayTime.isSame(moment(this.props.timestamp), 'day')) {
      timestampFormat = 'D MMMM H:mm';
    }
    var timestamp = moment(this.props.timestamp).format(timestampFormat);
    var editButton;
    if (this.props.author === this.props.user) {
      editButton = (
        <button
          onClick={this.handleWorkoutEdit}
          className='workout-meta-controls-btn'
          type='button'>
          <Icon name='edit' />
        </button>
      );
    }
    var edited = '';
    if (this.props.editedTimestamp) {
      edited = (
        <span title={moment(this.props.editedTimestamp).format('D MMMM H:mm')}>
          отредактировано
        </span>
      );
    }
    if (this.state.showForm) {
      return (
        <li className='workouts-item'>
          <div className='workout-userpic figure-userpic'>
            <img src={userpic} />
          </div>
          <form onSubmit={this.handleWorkoutUpdate} className='workout'>
            <div className='workout-meta'>
              <div className='workout-meta-body'>
                <strong className='workout-meta-user'>{this.props.username}</strong>, { timestamp } {edited ? ',' : ''} {edited}
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
            <div className='workout-heading'>Комплекс {this.props.index}.</div>
            <div className='workout-body'>
              <InputTextarea
                name={'workout_text_'+this.props.workoutId}
                autoFocus={true}
                text={this.state.editingText}
                onTextChange={this.handleEditingWorkoutTextUpdate}
                placeholder='Введите инструкции' />
            </div>
            <div className='workout-footer'>
              <button
                onClick={this.handleWorkoutDelete}
                className='workout-delete'
                type='button'
                disabled={this.state.removing}>
                Удалить комплекс
              </button>
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
                <strong className='workout-meta-user'>{this.props.username}</strong>, { timestamp } {edited ? ',' : ''} {edited}
              </div>
              <div className='workout-meta-controls'>
                {editButton}
              </div>
            </div>
            <div className='workout-heading'>Комплекс {this.props.index}.</div>
            <div className='workout-body'>
              {this.props.text}
            </div>
            <div className='workout-footer'>
              <span className='workout-footer-item'>0 (загруженные результаты)</span>
              <button onClick={this.handleWorkoutResultSubmit} className='workout-submit' type='button'>Загрузить результат</button>
            </div>
          </div>
        </li>
      );
    }
  }
});

module.exports = WorkoutsItem;
