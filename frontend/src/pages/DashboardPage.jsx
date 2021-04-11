import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Container,
  Sidebar,
  Content,
  Sidenav,
  FlexboxGrid
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import styled from 'styled-components';
import useToken from '../utils/useToken';
import QuizCard from '../components/QuizCard';

const DashboardStyled = styled(Content)`
height: 100%;
display: flex;
flex-direction: row;
flex-wrap: wrap;
`

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

  useEffect(() => {
    getQuizzes(token).then((data) => {
      setQuizzes(data.quizzes);
    })
  }, []);

  const handleLogout = () => {
    logout(token).then(data => {
      console.log('logging out');
      setToken('');
      history.push('/login');
    });
  }

  const headerStyle = {
    padding: 20,
    fontSize: 16,
    background: '#34c3ff',
    color: ' #fff'
  };

  return (
  <Container styles={{ height: '100%' }}>
    <Sidebar>
      <Sidenav activeKey="1">
        <Sidenav.Header>
          <div style={headerStyle}>BigBrain</div>
        </Sidenav.Header>
        <Sidenav.Body>
          <nav>
            <Button appearance="subtle" onClick={handleLogout}>Logout</Button>
          </nav>
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
    <DashboardStyled>
      <h3>Welcome to your Dashboard</h3>
      <FlexboxGrid>
        {quizzes.map((val, idx) => {
          if (val === null) {
            return <h1> Empty </h1>
          }
          return <QuizCard
            key={idx}
            QuizId={val.id}
          />
        })}
      </FlexboxGrid>
    </DashboardStyled>
  </Container>
  )
}
