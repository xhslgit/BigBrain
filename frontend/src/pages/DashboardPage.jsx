import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Header,
  Alert
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
// import styled from 'styled-components';
import useToken from '../utils/useToken';
import QuizCard from '../components/QuizCard';
import NewGameModal from '../components/NewGameModal';
import { LogoutButton, NewGameButton, QuizCardGrid, JoinGameButton, GlobalStyle } from '../style';

export default function DashboardPage () {
  const logout = (token) => {
    return fetch(new URL('admin/auth/logout', 'http://localhost:5005/'), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then((data) => {
      if (data.status === 200) {
        return data.json();
      } else {
        // error handling later
        return data.json();
      }
    });
  }
  const getQuizzes = (token) => {
    return fetch(new URL('admin/quiz', 'http://localhost:5005/'), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then((data) => {
      if (data.status !== 200) {
        Alert.error('Not logged in', 3000);
        history.push('/login');
      } else {
        return data.json();
      }
    });
  }
  const [quizzes, setQuizzes] = useState([]);
  const history = useHistory();

  const { token, setToken } = useToken();

  const getSetQuizzes = () => {
    getQuizzes(token).then((data) => {
      if (data) {
        const sorted = data.quizzes.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        setQuizzes(sorted);
      } else {
        history.push('/login');
      }
    })
  }

  useEffect(() => {
    getSetQuizzes();
  }, []);

  const handleLogout = () => {
    logout(token).then(data => {
      console.log('logging out');
      setToken('');
      history.push('/login');
    });
  }
  const handleJoinGame = () => {
    logout(token).then(data => {
      setToken('');
      history.push('/');
    });
  }

  const [showModal, setShowModal] = useState(false);
  const toggleShow = () => {
    setShowModal(!showModal);
  }
  return (
    <Fragment>
      <GlobalStyle />
        <NewGameButton appearance="primary" onClick={toggleShow} id="newgame-button">New Game</NewGameButton>
        <LogoutButton appearance="primary" onClick={handleLogout} id="logout-button">Logout</LogoutButton>
        <JoinGameButton appearance="primary" onClick={handleJoinGame} id="joingame-button">Join a Game</JoinGameButton>
        <Container>
          <Header style={{ textAlign: 'center' }}>
            <h1>BigBrain</h1>
            <h2>Welcome to your dashboard</h2>
          </Header>
          <QuizCardGrid align="top" justify="start" >
            {quizzes.map((item, idx) => (
              item
                ? (
                  <QuizCard
                    key={item.id}
                    QuizId={item.id}
                    onDelete={getSetQuizzes}
                    idx={idx}/>)
                : (
                  <h1> Empty </h1>
                  )
            ))}
          </QuizCardGrid>
          <NewGameModal
            showModal={showModal}
            onHide={toggleShow}
            onCreate={getSetQuizzes}
          />
        </Container>
    </Fragment>
  )
}
