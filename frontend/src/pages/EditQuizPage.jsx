import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  FlexboxGrid,
  Panel,
  Container,
  Content,
  Button,
  List
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';

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
  const QuizId = useParams().QuizId;
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
  const handleEditQuestion = (e) => {
    console.log(e);
  }
  return (
    <Container>
      <Content>
        <FlexboxGrid justify="center" style={{ marginTop: '5em' }}>
          <FlexboxGrid.Item>
            <Panel header={<h2>Edit Quiz: {name}</h2>} bordered>
              {thumbnail}
              <Button appearance="primary" onClick={handleAddQuestion}>Add Question</Button>
              <List bordered hover>
                {questions
                  ? (
                      questions.map((item, idx) => (
                        <List.item key={item.id} index={idx}>
                          <FlexboxGrid>
                            <FlexboxGrid.Item colspan={2}>
                              {item.question}
                            </FlexboxGrid.Item>
                            <FlexboxGrid>
                              <Button appearance="primary" onClick={e => handleEditQuestion(e)}>Edit Question</Button>
                            </FlexboxGrid>
                          </FlexboxGrid>
                        </List.item>
                      )))
                  : (
                      <p> this list has no questions</p>
                    )}
              </List>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
  );
}
