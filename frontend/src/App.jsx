import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DashboardResultsPage from './pages/DashboardResultsPage';
import EditQuizPage from './pages/EditQuizPage';
import EditQuestionPage from './pages/EditQuestionPage';
import GamePage from './pages/GamePage';
import JoinPage from './pages/JoinPage';
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
          <Route path='/dashboard/edit/:QuizId/:QuestionId'>
            <EditQuestionPage />
          </Route>
          <Route path='/dashboard/edit/:QuizId'>
            <EditQuizPage />
          </Route>
          <Route path='/dashboard/:QuizId/session/:SessionId/results'>
            <DashboardResultsPage />
          </Route>
          <Route path='/game/:SessionId/:PlayerId' exact>
            <GamePage />
          </Route>
          <Route path='/join/:SessionId' exact>
            <JoinPage />
          </Route>
          <Route path='/' exact>
            <JoinPage />
          </Route>
          <Route path='*' exact>
            <Redirect to='/' />
          </Route>
        </Switch>
    </Router>
  );
}
