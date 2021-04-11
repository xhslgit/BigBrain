import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

export default function App () {
  return (
    <Router>
        <Switch>
          <Route path='/login' exact>
            <LoginPage />
          </Route>
          <Route path='/register' exact>
            <RegisterPage />
          </Route>
          <Route path='/dashboard' exact>
            <DashboardPage />
          </Route>
        </Switch>
    </Router>
  );
}
