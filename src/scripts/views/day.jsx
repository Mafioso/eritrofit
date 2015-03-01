'use strict';

var Nav = require('../components/nav.jsx');
var Scroller = require('../components/scroller.jsx');
var api = require('../utils/api');

module.exports = React.createClass({
  render: function() {
    var text = "9-minute AMRAP: \n15 toes-to-bars \n10 deadlifts";
    return (
      <div>
        <Nav username={api.getEmail()} />
        <Scroller activeDay={this.props.params.day} />
        <ul className='workouts'>
          <li className='workouts-item'>
            <div className='workout-userpic figure-userpic'>
              <img src={api.getLargeBase64Userpic('igeeko@gmail.com')} />
            </div>
            <div className='workout'>
              <div className='workout-meta'>
                <strong className='workout-meta-user'>Username</strong>, datetime
              </div>
              <div className='workout-heading'>Комплекс 1.</div>
              <div className='workout-body'>
                {text}
              </div>
              <div className='workout-footer'>
                <span className='workout-footer-item'>0 submissions</span>
                <button className='workout-submit' type='button'>Submit result</button>
              </div>
            </div>
          </li>
          <li className='workouts-item'>
            <div className='workout-userpic figure-userpic'>
              <img src={api.getLargeBase64Userpic('igeeko@gmail.com')} />
            </div>
            <div className='workout'>
              <div className='workout-meta'>
                <strong className='workout-meta-user'>Username</strong>, datetime
              </div>
              <div className='workout-heading'>Комплекс 2.</div>
              <div className='workout-body'>
                {text}
              </div>
              <div className='workout-footer'>
                <span className='workout-footer-item'>0 submissions</span>
                <button className='workout-submit' type='button'>Submit result</button>
              </div>
            </div>
          </li>
        </ul>
        <button className='workout-add'>+ Add workout</button>
      </div>
    );
  }
});
