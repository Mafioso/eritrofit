'use strict';

var api = require('../utils/api');
var InputTextarea = require('./inputTextarea.jsx');
var DayStore = require('../stores/DayStore');
var DayActions = require('../actions/DayActions');

module.exports = React.createClass({
  _userpic: api.getLargeBase64Userpic(api.getCurrentUserId()),
  getInitialState: function() {
    return ({
      error: '',
      submitting: false,
      showForm: false,
      text: ''
    });
  },
  componentWillMount: function() {
    var self = this;
    DayStore.streams.createWorkoutSuccess.listen(function() {
      self.setState({
        submitting: false,
        showForm: false,
        text: ''
      });
    });
  },
  handleNewWorkoutTextUpdate: function(text) {
    this.setState({
      text: text
    });
  },
  toggleForm: function() {
    this.setState({
      showForm: !this.state.showForm
    });
  },
  handleFormSubmit: function(event) {
    event.preventDefault();
    this.setState({
      submitting: true
    });
    DayActions.createWorkout({
      text: this.state.text,
      day: this.props.day
    });
  },
  render: function() {
    var form;
    var toggleFormButtonText = '+ Добавить комплекс';
    if (this.state.showForm) {
      toggleFormButtonText = 'Отмена';
      form = (<form onSubmit={this.handleFormSubmit} className='workouts-form'>
        <div className='workout-userpic figure-userpic'>
          <img src={this._userpic} />
        </div>
        <div className='workout'>
          <div className='workout-meta'>
            <strong className='workout-meta-user'>
              {this.props.username}
            </strong>
          </div>
          <div className='workout-heading'>Новый комплекс.</div>
          <div className='workout-body'>
            <InputTextarea
              name='workout_text'
              autoFocus={true}
              text={this.state.text}
              onTextChange={this.handleNewWorkoutTextUpdate}
              placeholder='Введите инструкции' />
          </div>
          <div className='workout-footer'>
            <span className='workout-footer-item'>
              {this.state.error}
            </span>
            <button className='workout-submit' type='submit' disabled={this.state.submitting}>
              Сохранить
            </button>
          </div>
        </div>
      </form>);
    }
    return (
      <div>
        {form}
        <button onClick={this.toggleForm} className='workout-add' type='button' >
          {toggleFormButtonText}
        </button>
      </div>
    );
  }
});
