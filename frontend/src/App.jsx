import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';

export default function App () {
  return (
    <Router>
        <Switch>
          <Route path="/login" exact>
            <LoginPage />
          </Route>
        </Switch>
    </Router>
  );
}
