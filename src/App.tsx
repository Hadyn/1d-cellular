import React, {Component} from 'react';
import Drawer from "./Canvas";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

export default class App extends Component<{ }, { }> {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/" exact component={Drawer}/>
            <Route path="/:id" component={Drawer}/>
          </Switch>
        </div>
      </Router>
    )
  }
}