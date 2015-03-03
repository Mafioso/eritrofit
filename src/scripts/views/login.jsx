'use strict';

var Icon = require('../components/icon.jsx');
var AuthActions = require('../actions/AuthActions');
var AuthStore = require('../stores/AuthStore');
var views = require('../constants/views');
var routes = require('../constants/routes');

var Login = React.createClass({
  getInitialState: function() {
    return({
      error: { code: '' },
      waiting: false
    });
  },
  componentDidMount: function() {
    var self = this;
    AuthStore.streams.errors.listen(function(payload) {
      if (payload) {
        self.setState({ error: payload, waiting: false });
      }
    });
  },
  componentDidUpdate: function() {
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
        case 'INVALID_PASSWORD':
          this.refs.loginPassword.getDOMNode().select();
          break;
        default:
          break;
      }
    } else {
      this.refs.loginEmail.getDOMNode().focus();
    }
  },
  handleSubmit: function(event) {
    event.preventDefault();

    this.setState({ waiting: true });

    AuthActions.submitSignIn({
      email: this.refs.loginEmail.getDOMNode().value,
      password: this.refs.loginPassword.getDOMNode().value,
      router_data: {
        target_url: this.props.params.next_url || routes.INDEX,
        current_url: this.props.params.current_url,
        current_view: views.LOGIN
      }
    });
  },
  render: function() {
    var error;

    switch(this.state.error.code) {
      case 'EMPTY_PASSWORD':
      case 'INVALID_PASSWORD':
        error = (<div className='login-line login-line--error'>Неправильный пароль</div>);
        break;
      case 'EMPTY_EMAIL':
      case 'INVALID_USER':
        error = (<div className='login-line login-line--error'>Такого пользователя не существует</div>);
        break;
      default:
        break;
    }

    return (
      <form className='login' onSubmit={this.handleSubmit}>
        <div className='login-container'>
          <div className='login-heading'>
            <Icon name='logo' />
          </div>
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
              href='/#/login/reset-password'
              className='login-link'>
              Забыли пароль?
            </a>
          </div>

          {error}

          <button
            disabled={this.state.waiting}
            className='login-submit'
            type='submit'>
              Войти
          </button>

          <div className='login-line login-line--aligncenter'>
            Регистрация закрыта, ищите нас в Facebook.
          </div>
        </div>
      </form>
    );
  }
});

module.exports = Login;
