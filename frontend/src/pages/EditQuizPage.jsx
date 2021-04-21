import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  FlexboxGrid,
  Button,
  List,
  Uploader,
  Alert
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import { fileToDataUrl } from '../utils/helpers';
import useToken from '../utils/useToken';
import { GlobalStyle, QuizEditPanel, ImageContainer } from '../style';

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
    <Fragment>
      <GlobalStyle />
        <QuizEditPanel bordered>
          <h2 style={{ color: 'black' }} >Edit Quiz</h2>
          <h3>{name}</h3>
          <ImageContainer style={{ margin: 'auto' }}>
            <img src={thumbnail} style={{ width: '235px', height: '235px' }} alt='thumbnail preview'/>
          </ImageContainer>
          <br></br>
          <h5 style={{ color: 'black' }}>Upload thumbnail</h5>
          <Uploader listType="picture" accept="image/png, image/jpeg" fileListVisible={false} onChange={handleAddThumbnail} />
          <br></br>
          <Button appearance="primary" onClick={handleAddQuestion}>Add Question</Button>
          <br></br>
          <br></br>
          <List bordered hover>
            {questions && questions.length
              ? (
                  questions.map((item, idx) => (
                    <List.Item key={item.id} index={idx}>
                      <FlexboxGrid justify='space-between'>
                        <FlexboxGrid.Item >
                          <h4>{item.question}</h4>
                        </FlexboxGrid.Item>
                        <FlexboxGrid>
                          <Button style={{ margin: 'auto 3px' }} appearance="primary" onClick={() => handleEditQuestion(item.id)}>Edit Question</Button>
                          <Button style={{ margin: 'auto 3px' }} appearance="primary" onClick={() => handleDeleteQuestion(item.id)}>Delete Question</Button>
                        </FlexboxGrid>
                      </FlexboxGrid>
                    </List.Item>
                  )))
              : (
                  <h2>No questions has been added</h2>
                )}
          </List>
          <br></br>
          <p><i>Must click save to save any changes</i></p>
          <Button style={{ margin: '10px', marginTop: '0' }} appearance="primary" onClick={handleSaveQuiz}>Save</Button>
          <Button style={{ margin: '10px', marginTop: '0' }} appearance="ghost" onClick={handleBackQuiz}>Back</Button>
        </QuizEditPanel>
    </Fragment>
  );
}
