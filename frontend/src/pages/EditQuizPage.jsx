import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  FlexboxGrid,
  Panel,
  Container,
  Content,
  Button
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import QuestionsList from '../components/QuestionsList';

import useToken from '../utils/useToken';

// const PageContainer = styled(Container)`
//   width: 100%;
//   height: 100vh;
//   overflow: auto;
//   display: flex;
//   flex-direction: row;
//   justify: center;
// `

export default function EditQuizPage () {
  const QuizId = useParams().Quizid;
  const token = useToken().token;
  const history = useHistory();
  const [questions, setQuestions] = useState([]);
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');

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

  // const editQuizInfo = (token, id, payload) => {
  //   return fetch(new URL(`admin/quiz/${id}`, 'http://localhost:5005'), {
  //     method: 'PUT',
  //     headers: {
  //       accept: 'application/json',
  //       Authorization: 'Bearer' + token,
  //       'Content-Type': 'application/json',
  //     },
  //     body: payload,
  //   }).then((data) => {
  //     return data.json();
  //   })
  // }
  useEffect(() => {
    getQuizInfo(token, QuizId).then((data) => {
      setQuestions(data.questions);
      setName(data.name);
      setThumbnail(data.thumbnail);
    })
  }, [])

  const handleAddQuestion = () => {
    console.log('adding a question');
    history.push(`/dashboard/edit/${QuizId}/${uuidv4()}`);
  }
  return (
    <Container>
      <Content>
        <FlexboxGrid justify="center" style={{ 'margin-top': '5em' }}>
          <FlexboxGrid.Item>
            <Panel header={<h2>Edit Quiz: {name}</h2>} bordered>
              {thumbnail}
              <Button appearance="primary" onClick={handleAddQuestion}>Add Question</Button>
              <QuestionsList questions={questions} />
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
  );
}
