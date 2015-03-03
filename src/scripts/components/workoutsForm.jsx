'use strict';

var api = require('../utils/api');
var InputTextarea = require('./inputTextarea.jsx');
var moment = require('moment');

module.exports = React.createClass({
  getInitialState: function() {
    return ({
      error: '',
      submitting: false,
      showForm: false,
      author: '',
      username: '',
      text: ''
    });
  },
  componentDidMount: function() {
    this.setState({
      showForm: this.props.showForm
    });
  },
  handleNewWorkoutTextUpdate: function(text) {
    this.setState({
      text: text
    });
  },
  toggleForm: function() {
    this.setState({
      showForm: !this.state.showForm,
      submitting: false // TODO: REMOVE THIS!!!
    });
  },
  handleFormSubmit: function(event) {
    event.preventDefault();
    this.setState({
      submitting: true
    });

    // if (this.state.text.trim().length === 0) {
    //   this.setState({
    //     error: 'Вы забыли описать упражнения для комплекса',
    //     submitting: false
    //   });
    //   return;
    // } else {
    //   // REMOVE THIS LATER,
    //   // error should be emptied by event from store!
    //   this.setState({
    //     error: ''
    //   });
    // }

    this.props.onWorkoutSubmit(this.state.text);
  },
  render: function() {
    // var userpic = api.getLargeBase64Userpic(this.props.author);
    var userpic;
    var form;
    var toggleFormButtonText = '+ Добавить комплекс';
    if (this.state.showForm) {
      toggleFormButtonText = 'Отмена';
      form = (<form onSubmit={this.handleFormSubmit} className='workouts-form'>
        <div className='workout-userpic figure-userpic'>
          <img src={userpic} />
        </div>
        <div className='workout'>
          <div className='workout-meta'>
            <strong className='workout-meta-user'>
              {this.props.username}
            </strong>
          </div>
          <div className='workout-heading'>Комплекс {this.props.idx}.</div>
          <div className='workout-body'>
            <InputTextarea
              name={'workout'+this.props.idx}
              autoFocus={true}
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
