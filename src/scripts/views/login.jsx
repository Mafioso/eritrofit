'use strict';

var AuthActions = require('../actions/AuthActions');
var AuthStore = require('../stores/AuthStore');

var Login = React.createClass({
  getInitialState: function() {
    return({
      error: ''
    });
  },
  componentWillMount: function() {

  },
  componentDidMount: function() {
    var self = this;
    // userStore.listen(function(data) {
    //   console.log(data, '<<<<<< received data');
    // });
    AuthStore.streams.errors.listen(function(payload) {
      self.setState({ error: payload });
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    AuthActions.submitSignIn({
      email: this.refs.loginEmail.getDOMNode().value,
      password: this.refs.loginPassword.getDOMNode().value
    });
  },
  render: function() {
    var error;
    return (
      <form className='login' onSubmit={this.handleSubmit}>
        <div className='login-container'>
          <h1 className='login-heading'>Endurance Almaty</h1>
          <input
            autoFocus
            className='login-input login-input--email'
            type='email'
            ref='loginEmail'
            placeholder='Email'  />
          <input
            className='login-input login-input--password'
            type='password'
            ref='loginPassword'
            placeholder='Пароль' />
          <div className='login-line login-line--alignright'>
            <a
              href='#'
              className='login-link'>
              Забыли пароль?
            </a>
          </div>
          {error}
          <button className='login-submit' type='submit'>Войти</button>
          <div className='login-line login-line--aligncenter'>
            Регистрация закрыта, ищите нас в Facebook.
          </div>
        </div>
      </form>
    );
  }
});

module.exports = Login;