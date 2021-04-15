import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Container,
  Header,
  Sidebar,
  Sidenav,
  FlexboxGrid
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
// import styled from 'styled-components';
import useToken from '../utils/useToken';
import QuizCard from '../components/QuizCard';
import NewGameModal from '../components/NewGameModal';

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
      if (data.status === 200) {
        return data.json();
      } else {
        // error handling later
        return data.json();
      }
    });
  }
  const [quizzes, setQuizzes] = useState([]);
  const history = useHistory();

  const { token, setToken } = useToken();

  const getSetQuizzes = () => {
    getQuizzes(token).then((data) => {
      const sorted = data.quizzes.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      setQuizzes(sorted);
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

  const headerStyle = {
    padding: 18,
    fontSize: 16,
    height: 56,
    background: '#34c3ff',
    color: ' #fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  };
  const [showModal, setShowModal] = useState(false);
  const toggleShow = () => {
    setShowModal(!showModal);
  }
  return (
  <Container styles={{ height: '100%' }}>
    <Sidebar>
      <Sidenav activeKey="1">
        <Sidenav.Header>
          <div style={headerStyle}>BigBrain</div>
        </Sidenav.Header>
        <Sidenav.Body>
          <nav>
            <Button appearance="subtle" onClick={toggleShow}>New Game</Button>
          </nav>
          <nav>
            <Button appearance="subtle" onClick={handleLogout}>Logout</Button>
          </nav>
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
    <Container>
      <Header style={{ align: 'center' }}>
        <h2>Welcome to your dashboard</h2>
      </Header>
      <FlexboxGrid align="top" justify="space-around">
        {quizzes.map((val, idx) => {
          if (val === null) {
            return <h1> Empty </h1>
          }
          return <QuizCard
            key={val.id}
            QuizId={val.id}
            onDelete={getSetQuizzes}
          />
        })}
      </FlexboxGrid>
      <NewGameModal
        showModal={showModal}
        onHide={toggleShow}
        onCreate={getSetQuizzes}
      />
    </Container>
  </Container>
  )
}
