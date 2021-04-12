import React, { useState, useEffect } from 'react';
import {
  Panel,
  Button
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';
import useToken from '../utils/useToken';
import styled from 'styled-components';

const OptionsMenu = styled.div`
  display: flex;
  flex-direction: vertical;
`
export default function QuizCard ({ QuizId }) {
  const temp = useToken();
  const token = temp.token;
  const [quizInfo, setQuizInfo] = useState({});

  const getQuizInfo = (token, id) => {
    return fetch(new URL(`admin/quiz/${id}`, 'http://localhost:5005'), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
        quizid: id,
      },
    }).then((data) => {
      return data.json();
    });
  }

  useEffect(() => {
    getQuizInfo(token, QuizId).then((data) => {
      setQuizInfo(data);
    })
  }, []);

  const handleEdit = () => {
    console.log('edit')
  }

  const handleDelete = () => {
    console.log('Delete')
  }

  const handleStart = () => {
    console.log('start')
  }
  return (
    <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 240 }}>
      <img src="https://via.placeholder.com/240x240" height="240" />
      <Panel header={quizInfo.name}>
        <p>
          <small>{quizInfo.owner}</small>
        </p>
        <OptionsMenu>
          <Button appearance="primary" onClick={handleEdit}>Edit</Button>
          <Button appearance="primary" color="red" onClick={handleDelete}>Delete</Button>
          <Button appearance="primary" onClick={handleStart}>Start</Button>
        </OptionsMenu>
      </Panel>
    </Panel>
  )
}

QuizCard.propTypes = {
  QuizId: PropTypes.number.isRequired,
};
