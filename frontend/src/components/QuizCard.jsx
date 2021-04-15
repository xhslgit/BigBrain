import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
  flex-direction: row;
  column-gap: 5px;
`
export default function QuizCard ({ QuizId, onDelete }) {
  const temp = useToken();
  const token = temp.token;
  const [quizInfo, setQuizInfo] = useState({});
  const history = useHistory();

  const getQuizInfo = (token, id) => {
    return fetch(new URL(`admin/quiz/${id}`, 'http://localhost:5005'), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then((data) => {
      return data.json();
    });
  }
  const deleteQuiz = (token, id) => {
    return fetch(new URL(`admin/quiz/${id}`, 'http://localhost:5005'), {
      method: 'DELETE',
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
    history.push(`/dashboard/edit/${QuizId}`);
    console.log('edit');
  }

  const handleDelete = () => {
    deleteQuiz(token, QuizId).then((data) => {
      return onDelete();
    })
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
          <Button appearance="primary" onClick={handleStart}>Start</Button>
          <Button appearance="primary" onClick={handleEdit}>Edit</Button>
          <Button appearance="primary" color="red" onClick={handleDelete}>Delete</Button>
        </OptionsMenu>
      </Panel>
    </Panel>
  )
}

QuizCard.propTypes = {
  QuizId: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};
