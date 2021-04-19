import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button, Panel
} from 'rsuite';
// need to poll to see whenever the session is inactive again
// via question status fetch
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
  const [answers, setAnswers] = useState([]);
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
  // const getCorrectAnswer = id => {
  //   return fetch(new URL(`play/${id}/answer`, 'http://localhost:5005/'), {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json',
  //     }
  //   }).then((data) => {
  //     return data.json();
  //   })
  // }
  const [timer, setTimer] = useState(null);
  const calcTimer = (totalTime, time) => {
    const diff = Date.now() - Date.parse(time);
    console.log(totalTime - Math.floor(diff / 1000));
    setTimer(totalTime - Math.floor(diff / 1000));
  }
  useInterval(async () => {
    console.log('checking for question info update');
    const [questionData] = await Promise.all([getQuestion(PlayerId)]);
    if (questionData.error) {
      setGameStarted(false);
    } else {
      setGameStarted(true);
      console.log(questionData.question);
      setAnswers(questionData.question.answers);
      setQuestion(questionData.question);
      calcTimer(questionData.question.time, questionData.question.isoTimeLastQuestionStarted);
    }
  }, 500);
  useEffect(() => {
    if (timer > 1) {
      console.log('more than 1')
    } else {
      setTimer('No more time remaining');
      console.log('less than 1')
    }
    // disable questions n shit check for answers
  }, [timer])
  const colours = ['orange', 'yellow', 'violet', 'cyan'];
  return (
    <Panel bordered shaded>
      <h1> Gamepage </h1>
      {SessionId}
      {PlayerId}
      {!gameStarted
        ? (<h1>The game has not started, wait for admin to start</h1>)
        : (
          <Panel bordered>
            <h1>Question: {question.question}</h1>
            <h2>Points: {question.points}</h2>
            <h3>Time remaining: {timer}</h3>
            {answers.map((item, idx) => (
              <Button key={item.id} color={colours[idx]}>{item.answer}</Button>
            ))}
          </Panel>
          )}
    </Panel>
  )
}
