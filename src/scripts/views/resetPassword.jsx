'use strict';

var Icon = require('../components/icon.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      error: {code: ''}
    };
  },
  componentDidUpdate: function(prevProps, prevState) {
    // keep focus in email field
    if (this.state.error) {
      switch(this.state.error.code) {
        case 'EMPTY_EMAIL':
          this.refs.loginEmail.getDOMNode().focus();
          break;
        case 'EMPTY_PASSWORD':
          this.refs.loginPassword.getDOMNode().focus();
          break;
        case 'INVALID_USER':
          this.refs.loginEmail.getDOMNode().select();
          break;
        default:
          this.refs.loginEmail.getDOMNode().focus();
          break;
      }
    } else {
      this.refs.loginEmail.getDOMNode().focus();
    }
  },
  handleSubmit: function(event) {
    event.preventDefault();
    
    this.setState({
      error: {
        code:'INVALID_USER'
      }
    });
  },
  render: function() {
    var error;
    switch(this.state.error.code) {
      case 'EMPTY_EMAIL':
      case 'INVALID_USER':
        error = (<div className='login-line login-line--error'>Такого пользователя не существует</div>);
        break;
      default:
        break;
    }
    return(
      <form className='login' onSubmit={this.handleSubmit}>
        <div className='login-container'>
          <div className='login-heading'>
            <Icon name='logo' />
          </div>
          <div className='login-line'>Восстановление пароля</div>
          <input
            autoFocus
            className='login-input login-input--single'
            type='email'
            ref='loginEmail'
            placeholder='Email'  />

          {error}

          <button className='login-submit' type='submit'>Отправить письмо с инструкциями</button>
          <div className='login-line login-line--alignright'>
            или <a href='/#/login'>вернуться назад</a>
          </div>
        </div>
      </form>
    );
  }
});
