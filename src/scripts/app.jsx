'use strict';

window.React = require('react');

var page = require('page');
var routerActions = require('./actions/routerActions');
var routerStore = require('./stores/routerStore');
var views = require('./constants/views');
var routes = require('./constants/routes');

var Login = require('./views/login.jsx');

var RouteHandler = React.createClass({
  getInitialState: function() {
    return ({
      currentView: '',
      viewProps: {}
    });
  },
  componentWillMount: function() {

    page(routes.INDEX, function() {
      // console.log(routes.INDEX, 'matched!');
      routerActions({ currentView: views.INDEX });
    });
    page(routes.LOGIN, function() {
      // console.log(routes.LOGIN, 'matched!');
      routerActions({ currentView: views.LOGIN });
    });
    page(routes.DAY, function(ctx) {
      // console.log(routes.DAY, 'matched!');
      routerActions({ currentView: views.DAY, viewProps: ctx.params });
    });
  },
  componentDidMount: function() {
    var self = this;
    routerStore.listen(function(data) {
      // console.log(data, '<<<<< received data');
      self.setState({ currentView: data.currentView, viewProps: data.viewProps });
      if (data.redirectView !== data.currentView) {
        // console.log('should redirect!');
        page.redirect(data.redirectUrl);
      } else {
        // console.log('no need for redirect!');
      }
    });
    page({
      hashbang: true
    });
  },
  render: function() {
    var view;
    switch (this.state.currentView) {
      case views.LOGIN:
        view = <Login />;
        break;
      default:
        view = 'Default';
        break;
    }
    return (
      <div>
        {view}
      </div>
    );
  }
});

React.render(<RouteHandler />, document.getElementById('main'));