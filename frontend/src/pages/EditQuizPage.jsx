import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  FlexboxGrid,
  Panel,
  Container,
  Content,
  Button,
  List,
  Uploader,
  Alert
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import { fileToDataUrl } from '../utils/helpers';
import useToken from '../utils/useToken';
import styled from 'styled-components';

const ImageContainer = styled.div`
  width: 240px;
  height: 240px;
  border: 1px black solid;
  overflow: hidden;
`
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
  const editQuizInfo = (token, id, payload) => {
    return fetch(new URL(`admin/quiz/${id}`, 'http://localhost:5005'), {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: payload,
    }).then((data) => {
      return data.json();
    })
  }
  useEffect(() => {
    getQuizInfo(token, QuizId).then((data) => {
      console.log(data);
      setQuestions(data.questions);
      setName(data.name);
      setThumbnail(data.thumbnail);
    })
  }, [])

  const handleAddQuestion = () => {
    console.log('adding a question');
    history.push(`/dashboard/edit/${QuizId}/${uuidv4()}`);
  }
  const handleAddThumbnail = e => {
    const image = e.pop();
    if (image) {
      fileToDataUrl(image.blobFile).then((data) => {
        setThumbnail(data);
      })
    }
  }
  const handleEditQuestion = id => {
    history.push(`/dashboard/edit/${QuizId}/${id}`);
  }
  const handleDeleteQuestion = id => {
    setQuestions(questions.filter(item => item.id !== id));
  }
  const handleSaveQuiz = () => {
    const payload = {
      questions: questions,
      name: name,
      thumbnail: thumbnail
    }
    editQuizInfo(token, QuizId, JSON.stringify(payload)).then(() => {
      getQuizInfo(token, QuizId).then((data) => {
        setQuestions(data.questions);
      })
      Alert.success('Quiz saved', 3000);
    })
  }
  const handleBackQuiz = () => {
    history.push('/dashboard');
  }
  return (
    <Container>
      <Content width="50vw">
        <FlexboxGrid justify="center" style={{ marginTop: '5em' }}>
          <FlexboxGrid.Item>
            <Panel header={<div><h2>Edit Quiz</h2> <h3>{name}</h3></div>} bordered style={{ width: '50vw' }}>
              <h5>Change thumbnail</h5>
              <ImageContainer>
                <img src={thumbnail} style={{ width: '235px', height: '235px' }} alt='thumbnail preview'/>
              </ImageContainer>
              <br></br>
              <Uploader listType="picture" accept="image/png, image/jpeg" fileListVisible={false} onChange={handleAddThumbnail} />
              <br></br>
              <Button appearance="primary" onClick={handleAddQuestion}>Add Question</Button>
              <List bordered hover>
                {questions && questions.length
                  ? (
                      questions.map((item, idx) => (
                        <List.Item key={item.id} index={idx}>
                          <FlexboxGrid justify='space-between'>
                            <FlexboxGrid.Item>
                              {item.question}
                            </FlexboxGrid.Item>
                            <FlexboxGrid>
                              <Button appearance="primary" onClick={() => handleEditQuestion(item.id)}>Edit Question</Button>
                              <Button appearance="primary" onClick={() => handleDeleteQuestion(item.id)}>Delete Question</Button>
                            </FlexboxGrid>
                          </FlexboxGrid>
                        </List.Item>
                      )))
                  : (
                      <p> this list has no questions</p>
                    )}
              </List>
              <Button appearance="primary" onClick={handleSaveQuiz}>Save</Button>
              <Button appearance="subtle" onClick={handleBackQuiz}>Back</Button>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
  );
}
