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
import EditQuizPage from './pages/EditQuizPage';
import EditQuestionPage from './pages/EditQuestionPage';

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
          <Route path='/dashboard/edit/:QuizId' exact>
            <EditQuizPage />
          </Route>
          <Route path='/dashboard/edit/:QuizId/:QuestionId' exact>
            <EditQuestionPage />
          </Route>
        </Switch>
    </Router>
  );
}
