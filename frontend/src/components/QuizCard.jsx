import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Panel,
  Button,
  Alert,
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';
import useToken from '../utils/useToken';
import { ImageContainer, QuizCardPanel, OptionsMenu } from '../style';
import GameEndedModal from './GameEndedModal';
import StartGameModal from './StartGameModal';

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
      },
    }).then((data) => {
      return data.json();
    });
  }

  const advanceQuestion = (token, id) => {
    return fetch(new URL(`admin/quiz/${id}/advance`, 'http://localhost:5005'), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then((data) => {
      return data.json();
    });
  }

  const getQuestionStatus = (token, session) => {
    return fetch(new URL(`admin/session/${session}/status`, 'http://localhost:5005'), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
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
          time += Number(q.time);
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
      showStartModal(true);
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
    Alert.success('Link copied to clipboard', 2000);
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`${quizInfo.active}`);
    Alert.success('Code copied to clipboard', 2000);
  }
  const handleAdvanceQuestion = () => {
    getQuestionStatus(token, quizInfo.active).then((data) => {
      if (data.error) {
        Alert.error(data.error, 3000);
      } else if (data.results.position !== -1 && !data.results.answerAvailable) {
        Alert.info('Waiting for question to finish, cant advance yet', 3000);
      } else {
        advanceQuestion(token, QuizId).then(() => {
          Alert.success('Advanced to next question', 3000);
        })
      }
    })
  }
  return (
    <QuizCardPanel shaded bordered bodyFill >
      <ImageContainer>
        <img src={quizInfo.thumbnail} height="235px" width="235px" alt="thumbnail preview" />
      </ImageContainer>
      <Panel style={{ textAlign: 'center' }}>
        <h4 style={{ color: 'black' }}>{quizInfo.name}</h4>
        {quizInfo.questions && quizInfo.questions.length
          ? <p>{quizInfo.questions.length} Questions total<br></br>Quiz duration: {totalTime}s</p>
          : <p><u>No questions added yet</u></p>
        }
        <p>Quiz created by: <b>{quizInfo.owner}</b></p>
        <Button appearance="primary" onClick={handleStart}>{!quizInfo.active ? 'Start session' : 'View session'}</Button>
        <OptionsMenu>
          <Button appearance="primary" onClick={handleEdit}>Edit</Button>
          <Button appearance="ghost" color="red" onClick={handleStop}>Stop</Button>
          <Button appearance="primary" color="red" onClick={handleDelete}>Delete</Button>
        </OptionsMenu>
      </Panel>
        <StartGameModal
          showModal={startModal}
          onHide={() => showStartModal(false)}
          onCopyLink={handleCopyLink}
          onCopyCode={handleCopyCode}
          onAdvance={handleAdvanceQuestion}
          quizInfo={quizInfo}
        />
        <GameEndedModal
          showModal={resultsModal}
          onHide={() => showResultsModal(false)}
          onResults={() => history.push(`/dashboard/${QuizId}/session/${endedSession}/results`)}
        />
    </QuizCardPanel>
  )
}

QuizCard.propTypes = {
  QuizId: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};
