import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Panel, Divider, Alert
} from 'rsuite';
import ReactPlayer from 'react-player'
import { AllAnswerContainer, AnswerBox } from '../style';
// TODO
// results page, for 2.4.3 and 2.3.3
// fix styling and formating for all pages
export default function GamePage () {
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
          console.log(res);
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
      })
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

  const colours = ['orange', 'peru', 'violet', 'cyan', 'indigo', 'cream'];
  const handleAnswerClicked = (id, answer) => {
    // console.log(id, answer);
    let answerIds = [];
    // if single
    if (answerType === 'single') {
      // if single and selecting same answer, error
      if (selectedAnswers.some(e => e.id === id)) {
        Alert.error('Must have one answer selected, select another answer to change');
        answerIds = [id];
      } else { // single and select another answer, replace selectedanswers
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
    updateAnswer(PlayerId, answerIds);
  }
  return (
    <Panel bordered shaded>
      <h1> Gamepage </h1>
      {SessionId}
      {PlayerId}
      {!gameEnded
        ? !gameStarted
            ? (<h1>The game has not been started, wait for admin to start</h1>)
            : (
          <Panel bordered>
            <h1>Question: {question.question}</h1>
            <h2>Points: {question.points}</h2>
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
                    <h4> Selected answers: {selectedAnswers.map((item, idx) => (
                      <p key={item.id} style={{ display: 'inline' }}>{item.answer} </p>
                    ))} </h4>
                    <AllAnswerContainer>
                    {answers.map((item, idx) => (
                      <AnswerBox colour={colours[idx]} key={item.id} selected={selectedAnswers.some(e => e.id === item.id)}onClick={() => { handleAnswerClicked(item.id, item.answer) }}>
                        {item.answer}
                      </AnswerBox>
                    ))}
                    </AllAnswerContainer>)
                </div>)
              : (
                <div>
                  <h1>
                  {displayCorrectAnswers.length > 1 ? 'Correct answers:' : 'Correct answer:'}
                  </h1>
                  {displayCorrectAnswers.map((item) => (<h2 style={{ display: 'inline' }}key={item.id}>- {item.answer}<br></br></h2>))}
                  <h3>Waiting for admin to continue to next question</h3>
                </div>
                )}
            </Panel>)
        : (<div>
            <h1>game ended results</h1>
            {finalResults.map((item, idx) => (
              <div key={item.question}>
                <h3>Question {idx + 1}</h3>
                <p>{item.result ? 'Correct!' : 'Incorrect!'}</p>
                <p>Took you {item.timeTaken} seconds to answer</p>
              </div>
            ))}
          </div>)}
    </Panel>
  )
}
