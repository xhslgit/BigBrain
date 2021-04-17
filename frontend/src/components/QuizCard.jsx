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
const ImageContainer = styled.div`
  width: 240px;
  height: 240px;
  outline: 2px black solid;
  overflow: hidden;
`
export default function QuizCard ({ QuizId, onDelete }) {
  const temp = useToken();
  const token = temp.token;
  const [quizInfo, setQuizInfo] = useState({});
  const history = useHistory();
  const [totalTime, setTotalTime] = useState(0);
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
      if (data.questions) {
        let time = 0;
        for (const q of data.questions) {
          time += q.time;
        }
        setTotalTime(time);
      }
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
      <ImageContainer>
        <img src={quizInfo.thumbnail} height="235px" width="235px" alt="thumbnail preview" />
      </ImageContainer>
      <Panel header={quizInfo.name}>
        {quizInfo.questions && quizInfo.questions.length
          ? <p>Total questions: {quizInfo.questions.length}<br></br>Total duration of quiz: {totalTime}s</p>
          : <p>No questions added yet</p>
        }
        <p>Created by: {quizInfo.owner}</p>
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
