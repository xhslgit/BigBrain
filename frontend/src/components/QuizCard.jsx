import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Panel,
  Button,
  Modal,
  Alert,
  Divider
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';
import useToken from '../utils/useToken';
import styled from 'styled-components';

const OptionsMenu = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 5px;
  row-gap: 5px;
`
const ImageContainer = styled.div`
  width: 240px;
  height: 240px;
  outline: 2px black solid;
  overflow: hidden;
`
export default function QuizCard ({ QuizId, onDelete }) {
  const token = useToken().token;
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

  const startSession = (token, id) => {
    return fetch(new URL(`admin/quiz/${id}/start`, 'http://localhost:5005'), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then((data) => {
      return data.json();
    })
  }
  const endSession = (token, id) => {
    return fetch(new URL(`admin/quiz/${id}/end`, 'http://localhost:5005'), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then((data) => {
      return data.json();
    })
  }
  const [startModal, showStartModal] = useState(false);
  const handleStart = () => {
    if (quizInfo.active) {
      history.push(`/game/${quizInfo.active}`);
    } else {
      startSession(token, QuizId).then(() => {
        getQuizInfo(token, QuizId).then((data) => {
          setQuizInfo(data);
          showStartModal(true);
        })
      })
    }
  }
  const [resultsModal, showResultsModal] = useState(false);
  const [endedSession, setEndedSession] = useState('');
  const handleStop = () => {
    if (quizInfo.active) {
      setEndedSession(quizInfo.active);
      endSession(token, QuizId).then(() => {
        getQuizInfo(token, QuizId).then((data) => {
          showResultsModal(true);
          setQuizInfo(data);
        })
      })
    } else {
      Alert.error('Session has not started yet', 5000);
    }
  }
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/join/${quizInfo.active}`);
    Alert.info('Copied to clip board', 2000);
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
          <Button appearance="primary" onClick={handleStart}>{!quizInfo.active ? 'Start session' : 'View session'}</Button>
          <Button appearance="ghost" color="red" onClick={handleStop}>Stop</Button>
          <Button appearance="primary" onClick={handleEdit}>Edit</Button>
          <Button appearance="primary" color="red" onClick={handleDelete}>Delete</Button>
        </OptionsMenu>
      </Panel>
      <Modal backdrop="static" show={startModal} onHide={() => showStartModal(false)} size="xs">
          <Modal.Header>
            <h2>Game Started</h2>
          </Modal.Header>
          <Modal.Body style={{ textAlign: 'center' }}>
            Session has started, your Session ID is {quizInfo.active}
            <br></br>
            Head over to http://localhost:3000/join/{quizInfo.active}
            <Divider>Or</Divider>
            Copy the link below
          </Modal.Body>
          <Modal.Footer style={{ textAlign: 'right' }}>
            <Button onClick={handleCopyLink} appearance="primary">Copy link to clipboard</Button>
            <Button onClick={() => showStartModal(false)} appearance="ghost">Back to dashboard</Button>
          </Modal.Footer>
        </Modal>

        <Modal backdrop="static" show={resultsModal} onHide={() => showResultsModal(false)} size="xs">
          <Modal.Body style={{ textAlign: 'center' }}>
          <Modal.Header>
            <h2>Game Ended</h2>
          </Modal.Header>
            You have ended your session
            <br></br>
            If you would like to view results, click below
          </Modal.Body>
          <Modal.Footer style={{ textAlign: 'right' }}>
            <Button onClick={() => history.push(`/dashboard/${QuizId}/session/${endedSession}/results`)} appearance="primary">See results</Button>
            <Button onClick={() => showResultsModal(false)} appearance="ghost">Back to dashboard</Button>
          </Modal.Footer>
        </Modal>
    </Panel>
  )
}

QuizCard.propTypes = {
  QuizId: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};
