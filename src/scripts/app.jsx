'use strict';

window.React = require('react');

var director = require('director');
// var router = new director.Router();
var routerActions = require('./actions/routerActions');
var routerStore = require('./stores/routerStore');
var routes = require('./constants/routes');
var views = require('./constants/views');

var Home = require('./views/home.jsx');
var Login = require('./views/login.jsx');

var appContainer = document.getElementById('main');

// var router = new director.Router();

var RouteHandler = React.createClass({
  getInitialState: function() {

    return ({
      next: routerStore.defaultRoute,
      routerActionsDisabled: false
    });
  },
  componentWillMount: function() {
    var routerConfiguration = {};
    var self = this;
    function returnRouterActions(route) {
      return function(args) {
        // check if routerActionsDisabled is true
        // don't emit new routerAction
        // set routerActionsDisable to false again
        if (!this.state.routerActionsDisabled) {
          routerActions({ next: views[route], args: args});
        }
        this.setState({routerActionsDisabled: false});
      };
    }
    for (var route in routes) {
      routerConfiguration[routes[route]] = returnRouterActions(route);
    }
    var router = new director.Router(routerConfiguration);
    router.init('/');
  },
  componentDidMount: function() {
    var self = this;
    routerStore.listen(function(data) {
      // set routerActionsDisabled to true if
      // current url is different from data.next
      // update current url to the desired one
      self.setState({ next: data.next, data: data});
    });
  },
  render: function() {
    var view;

    switch (this.state.next) {
      case routes.INDEX:
        view = <Home />;
        break;
      case routes.LOGIN:
        view = <Login />;
        break;
      case routes.DAY:
        console.log(this.state);
        view = <Home />;
        break;
      default:
        // 404 page here
        console.log('404');
        break;
    }
    return (
      <div>
        {view}
      </div>
    );
  }
});

React.render(<RouteHandler />, appContainer);