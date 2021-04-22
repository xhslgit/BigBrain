import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Panel, Divider, Alert
} from 'rsuite';
import ReactPlayer from 'react-player'
import { AllAnswerContainer, AnswerBox, GamePagePanel, GlobalStyle } from '../style';
import CorrectAnswers from '../components/CorrectAnswers';
import PlayerGameEnded from '../components/PlayerGameEnded';

export default function GamePage () {
  const history = useHistory();
  const useInterval = (callback, delay) => {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      const tick = () => {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => {
          clearInterval(id);
        }
      }
    }, [callback, delay]);
  }
  const { SessionId, PlayerId } = useParams();
  if (!PlayerId) {
    Alert.error('You must have a name before you join the game');
    history.push(`/join/${SessionId}`);
  }
  const [answers, setAnswers] = useState([]);
  const [media, setMedia] = useState('none');
  const [answerType, SetAnswerType] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [question, setQuestion] = useState({
    id: '',
    question: '',
    type: '',
    points: '',
    time: '',
    media: '',
    isoTimeLastQuestionStarted: ''
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const getQuestion = id => {
    return fetch(new URL(`play/${id}/question`, 'http://localhost:5005/'), {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    }).then((data) => {
      return data.json();
    });
  }
  const updateAnswer = (id, payload) => {
    return fetch(new URL(`play/${id}/answer`, 'http://localhost:5005/'), {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answerIds: payload }),
    }).then((data) => {
      return data.json();
    })
  }
  const getCorrectAnswer = id => {
    return fetch(new URL(`play/${id}/answer`, 'http://localhost:5005/'), {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    }).then((data) => {
      return data.json();
    })
  }
  const getFinalResults = id => {
    return fetch(new URL(`play/${id}/results`, 'http://localhost:5005/'), {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    }).then((data) => {
      return data.json();
    })
  }
  const [timer, setTimer] = useState(null);
  const calcTimer = (totalTime, time) => {
    const diff = Date.now() - Date.parse(time);
    setTimer(totalTime - Math.floor(diff / 1000));
  }
  useInterval(async () => {
    const [questionData] = await Promise.all([getQuestion(PlayerId)]);
    if (questionData.error) {
      if (questionData.error === 'Session ID is not an active session') {
        setGameEnded(true);
      } else {
        setGameEnded(false);
        setGameStarted(false);
      }
    } else {
      setGameStarted(true);
      setAnswers(questionData.question.answers);
      setMedia(questionData.question.media);
      SetAnswerType(questionData.question.type);
      setQuestion(questionData.question);
      calcTimer(questionData.question.time, questionData.question.isoTimeLastQuestionStarted);
    }
  }, 500);
  useEffect(() => {
    if (timer <= 1) {
      handleTimesUp();
    } else {
      setTimesUp(false);
    }
  }, [timer])

  const [finalResults, setFinalResults] = useState([]);
  useEffect(() => {
    if (gameEnded === true) {
      getFinalResults(PlayerId).then((data) => {
        const resultsArr = [];
        let idx = 0;
        for (const res of data) {
          const diff = Date.parse(res.answeredAt) - Date.parse(res.questionStartedAt);
          const payload = {
            question: idx,
            timeTaken: Math.floor(diff / 1000),
            result: res.correct,
          }
          resultsArr.push(payload);
          idx++;
        }
        setFinalResults(resultsArr);
      });
    }
  }, [gameEnded])
  const [timesUp, setTimesUp] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [displayCorrectAnswers, setDisplayCorrectAnswers] = useState([]);
  const handleResultsScreen = () => {
    const newArr = [];
    if (question.answers) {
      for (const answer of question.answers) {
        if (correctAnswers) {
          if (correctAnswers.some(e => e === answer.id)) {
            newArr.push({ id: answer.id, answer: answer.answer });
          }
        }
      }
    }
    setDisplayCorrectAnswers(newArr);
  }
  const handleTimesUp = () => {
    setTimesUp(true);
    getCorrectAnswer(PlayerId).then((data) => {
      setCorrectAnswers(data.answerIds);
    })
    handleResultsScreen();
  }
  useEffect(() => {
    setSelectedAnswers([]);
  }, [question.question]);

  const colours = ['orange', 'peru', 'violet', 'cyan', 'indigo', 'blue'];
  // This function doesnt allow the player to select the same answer again,
  // or if the player has already selected one, the player cannot unselect it if he has only one answer selected
  const handleAnswerClicked = (id, answer) => {
    let answerIds = [];
    if (answerType === 'single') {
      if (selectedAnswers.some(e => e.id === id)) {
        Alert.error('Must have one answer selected, select another answer to change');
        answerIds = [id];
      } else {
        setSelectedAnswers([{ id: id, answer: answer }]);
        answerIds = [id];
      }
    } else {
      if (selectedAnswers.some(e => e.id === id)) {
        if (selectedAnswers.length === 1) {
          Alert.error('Must have one answer selected, select another answer to change');
        } else {
          const newArr = selectedAnswers.filter(e => e.id !== id);
          for (const answer of newArr) {
            answerIds.push(answer.id);
          }
          setSelectedAnswers(newArr);
        }
      } else {
        const newArr = selectedAnswers;
        newArr.push({ id: id, answer: answer });
        for (const answer of newArr) {
          answerIds.push(answer.id);
        }
        setSelectedAnswers(newArr);
      }
    }
    updateAnswer(PlayerId, answerIds).then((data) => {
      if (data.error) {
        Alert.error(data.error);
      }
    });
  }
  return (
    <Fragment>
      <GlobalStyle/>
      <GamePagePanel bordered shaded>
        <h1> In Game Session {SessionId} </h1>
        {!gameEnded
          ? !gameStarted
              ? (<h3>The guiz has not yet begun, wait for admin to start the quiz</h3>)
              : (
            <Panel bordered>
              <h2>Question: {question.question}</h2>
              <h3><u>Points: {question.points}</u></h3>
              {!timesUp
                ? (
                  <div>
                    <h3>Time remaining: {timer}</h3>
                      {media === 'none'
                        ? (
                        <div>
                          <Divider></Divider>
                        </div>
                          )
                        : (
                          <div>
                            {media.startsWith('data:image')
                              ? (
                                <img src={media} />)
                              : (
                                <ReactPlayer url={media} />
                                )}
                          </div>)
                      }
                      <h4> Answers that have been selected: {selectedAnswers.map((item, idx) => (
                        <p key={item.id} style={{ display: 'inline' }}><br></br>{item.answer}</p>
                      ))} </h4>
                      <br></br>
                      <AllAnswerContainer>
                      {answers.map((item, idx) => (
                        <AnswerBox colour={colours[idx]} key={item.id} selected={selectedAnswers.some(e => e.id === item.id)}onClick={() => { handleAnswerClicked(item.id, item.answer) }}>
                          {item.answer}
                        </AnswerBox>
                      ))}
                      </AllAnswerContainer>
                  </div>)
                : (
                  <CorrectAnswers
                    displayCorrectAnswers={displayCorrectAnswers}
                  />
                  )}
              </Panel>)
          : (
            <PlayerGameEnded
              finalResults={finalResults}
              onJoin={() => history.push('/join')}
            />
            )}
      </GamePagePanel>
    </Fragment>
  )
}
