import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function GamePage () {
  const { SessionId, PlayerId } = useParams();
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
  const getQuestion = (id) => {
    return fetch(new URL(`play/${id}/question`, 'http://localhost:5005/'), {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    }).then((data) => {
      return data.json();
    })
  }
  useState(() => {
    getQuestion(PlayerId).then((data) => {
      if (data.error) {
        setGameStarted(false);
      } else {
        setGameStarted(true);
        console.log(data);
        setQuestion(data.question);
      }
    })
  }, [])
  return (
    <div>
      <h1> Gamepage </h1>
      {SessionId}
      {PlayerId}
      {!gameStarted
        ? (<h1>The game has not started, wait for admin to start</h1>)
        : (
          <h1>{question.question}</h1>
          )}
    </div>
  )
}
