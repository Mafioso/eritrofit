'use strict';

var Icon = require('./icon.jsx');
var moment = require('moment');
var api = require('../utils/api');

module.exports = React.createClass({
  render: function() {
    var userpic = api.getBase64Userpic(this.props.user);
    var today = moment().format('DDMMYY');
    var todayUrl = '/#/day/' + today;
    return (
      <header className='body-header'>
        <a href={todayUrl} className='nav-link nav-link--logo'>
          <Icon name='logo' />
        </a>
        <nav className='nav'>
          <ul className='nav-list'>
            <li className='nav-list-item'>
              <a href={todayUrl} className='nav-link nav-link--active'>Тренировки</a>
            </li><li className='nav-list-item nav-list-item--extended'>
              <a href='/#/' className='nav-link nav-link--user'>
                <span className='figure-userpic figure-userpic--nav'>
                  <img src={userpic} alt={this.props.username} />
                </span>
                <Icon name='arrow-down' />
              </a>
              <ul className='nav-list-extra'>
                <li className='nav-list-extra-item'>
                  <span className='nav-link nav-link--dummy'>
                    Привет, <strong>{this.props.username}</strong>!
                  </span>
                </li>
                <li className='nav-list-extra-item'>
                  <a href='/#/logout' className='nav-link'>Выход</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
});
