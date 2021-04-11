import React, { useState, useEffect } from 'react';
import {
  Panel
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';
import useToken from '../utils/useToken';

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
  // const fetchQuiz = useCallback(
  //   () => getQuizInfo(token, QuizId).then((data) => {
  //     setQuizInfo(data);
  //   }),
  //   [token, QuizId],
  // );

  // useEffect(() => {
  //   fetchQuiz();
  // }, [fetchQuiz]);

  // console.log(quizInfo);
  useEffect(() => {
    getQuizInfo(token, QuizId).then((data) => {
      // console.log('data: ', data);
      setQuizInfo(data);
    })
  }, []);

  return (
    <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 240 }}>
      <img src="https://via.placeholder.com/240x240" height="240" />
      <Panel header={quizInfo.name}>
        <p>
          <small>yo haha</small>
        </p>
      </Panel>
    </Panel>
  )
}

QuizCard.propTypes = {
  QuizId: PropTypes.number.isRequired,
};
