'use strict';

// var Icon = require('./icon.jsx');
var moment = require('moment');

module.exports = React.createClass({
  render: function() {
    var cx = React.addons.classSet;
    var is_active = false;
    var subtitle;
    var title;
    var now = moment();
    var then = moment(this.props.day, 'DDMMYY');
    var activeDay = moment(this.props.activeDay, 'DDMMYY');
    var href = '/#/day/'+this.props.day;

    subtitle = then.format('D MMMM');

    if (now.isSame(then, 'day')) {
      title = then.calendar();
    } else {
      title = then.format('dddd');
    }

    if (then.isSame(activeDay, 'day')) {
      is_active = true;
    }

    var classes = cx({
      'scroller-week-day': true,
      'is-active': is_active
    });

    return (
      <a href={href} key={this.props.day} className={classes}>
        <span className="scroller-week-day-title">
          {title}
        </span>
        <span className="scroller-week-day-date">{subtitle}</span>
      </a>
    );

  }
});
