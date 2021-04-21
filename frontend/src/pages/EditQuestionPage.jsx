import React, { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Form,
  FormGroup,
  Schema,
  ControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  InputNumber,
  Button,
  Uploader,
  Alert,
  List,
  FlexboxGrid,
  Toggle,
  Input
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import { fileToDataUrl, matchYoutubeUrl } from '../utils/helpers';
import useToken from '../utils/useToken';
import { QuestionEditPanel, ImageContainer } from '../style';
const { StringType, NumberType } = Schema.Types;

export default function EditQuestionPage () {
  const model = Schema.Model({
    question: StringType().isRequired('What is your question?')
      .maxLength(100, 'Max 100 characters for a question'),
    type: StringType().isRequired('What type is your question?'),
    points: NumberType()
      .isInteger('Please enter an integer')
      .isRequired('How much is your question worth?'),
    time: NumberType()
      .isInteger('Please enter an integer')
      .isRequired('How long will this question last for?'),
    image: null,
    video: null,
  });
  const token = useToken().token;
  const history = useHistory();
  const { QuizId, QuestionId } = useParams();
  const [questionForm, setQuestionForm] = useState({
    id: QuestionId,
    question: '',
    type: 'single',
    points: 1,
    time: 30,
    mediainput: 'noneinput',
    video: '',
    image: '',
    answers: [],
  });
  const [title, setTitle] = useState('New Question');
  const editQuizInfo = (token, id, payload) => {
    console.log(payload);
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
  useEffect(() => {
    getQuizInfo(token, QuizId).then((data) => {
      for (const q of data.questions) {
        if (q.id === QuestionId) {
          console.log('exists');
          setQuestionForm(q);
          console.log(questionForm);
          setAnswers(q.answers);
          return;
        }
      }
      setTitle('New Question');
    })
  }, [QuestionId, title]);
  const [mediaType, setMediaType] = useState('noneinput');
  const newAnswer = () => ({
    id: uuidv4(),
    answer: 'Edit to change your answer',
    is_correct: false,
  });
  const [answers, setAnswers] = useState([newAnswer(), newAnswer()])
  const handleTimeChange = e => {
    const newArr = questionForm;
    newArr.time = e;
    setQuestionForm(newArr);
  }
  const handlePointChange = e => {
    const newArr = questionForm;
    newArr.points = e;
    setQuestionForm(newArr);
  }
  const handleTypeChange = e => {
    const newArr = questionForm;
    newArr.type = e;
    setQuestionForm(newArr);
  }
  const handleMediaChange = e => {
    setMediaType(e);
    const newArr = questionForm;
    newArr.mediainput = e;
    setQuestionForm(newArr);
  }

  const handleImageChange = e => {
    const image = e.pop();
    if (image) {
      fileToDataUrl(image.blobFile).then((data) => {
        const newArr = questionForm;
        newArr.image = data;
        newArr.video = '';
        setQuestionForm(newArr);
      })
    }
  }

  const handleVideoChange = e => {
    const newArr = questionForm;
    newArr.image = '';
    newArr.video = e;
    setQuestionForm(newArr);
  }

  const handleSubmit = () => {
    console.log(questionForm);
    try {
      checkQuestionForm();
      checkAnswerForm();
      const finalQuestion = questionForm;
      finalQuestion.answers = answers;
      getQuizInfo(token, QuizId).then((data) => {
        let newQ = 0;
        let questionsArr = [...data.questions];
        for (const q of data.questions) {
          if (q.id === finalQuestion.id) {
            newQ = 1;
            questionsArr = (questionsArr.filter(item => item.id !== finalQuestion.id));
          }
        }
        const newArr = [...questionsArr, finalQuestion];
        const payload = {
          questions: newArr,
          name: data.name,
          thumbnail: data.thumbnail
        };
        editQuizInfo(token, QuizId, JSON.stringify(payload)).then(() => {
          if (newQ) {
            Alert.success('Question edited', 4000);
          } else {
            Alert.success('Question created', 4000);
          }
          history.push(`/dashboard/edit/${QuizId}`);
        });
      })
    } catch (e) {
      Alert.error(e.message, 7000);
    }
  }
  const checkAnswerForm = () => {
    let counter = 0;
    for (const a of answers) {
      if (a.is_correct === true) {
        counter++;
      }
    }
    if (counter === 0) throw new Error('You have selected no correct answers');

    counter = 0;
    if (questionForm.type === 'single') {
      for (const a of answers) {
        if (a.is_correct === true) {
          counter++;
        }
      }
      if (counter > 1) throw new Error('You have selected single type question but have multiple answers');
    }
    counter = 0;
    if (questionForm.type === 'multiple') {
      for (const a of answers) {
        if (a.is_correct === true) {
          counter++;
        }
      }
      if (counter === 1) throw new Error('You have selected multiple type question but only have one correct answer');
    }

    for (const a of answers) {
      if (a.answer === '') {
        throw new Error('One of your answers is invalid');
      }
    }
  }
  const checkQuestionForm = () => {
    if (questionForm.question === '' || questionForm.length <= 5) throw new Error('Please enter a question');

    if (questionForm.type !== 'single' && questionForm.type !== 'multiple') throw new Error('Please select a question type');

    if (questionForm.points === '') throw new Error('Please select how many points the question will be worth');

    if (questionForm.time === '') throw new Error('Please select how long the question will last for');

    if (questionForm.mediatype === 'videoinput' && questionForm.video === '' && !matchYoutubeUrl(questionForm.video)) throw new Error('Enter a valid youtube video link');

    if (questionForm.mediatype === 'imageinput' && questionForm.image === '') throw new Error('Please try to upload image again');
  }
  const handleNewAnswer = () => {
    if (answers.length < 6) {
      setAnswers([...answers, newAnswer()]);
    } else {
      Alert.warning('Max 6 answers for a question');
    }
  }
  const handleDeleteAnswer = id => {
    if (answers.length >= 3) {
      setAnswers(answers.filter(item => item.id !== id));
    } else {
      Alert.warning('Can not have less than 2 answers', 2000);
    }
  }
  const handleCorrectAnswerChange = (e, id) => {
    for (const a of answers) {
      if (a.id === id) {
        a.is_correct = e;
      }
    }
  }
  const handleEditAnswer = (e, id) => {
    for (const a of answers) {
      if (a.id === id) {
        a.answer = e;
      }
    }
  }
  return (
    <QuestionEditPanel shaded header={<h1 style={{ textAlign: 'center' }}>{title}</h1>}>
      <Form
        model = {model}
        fluid
        layout = 'vertical'
        formValue = {questionForm}
        onChange = {newValue => setQuestionForm(newValue)}
        onSubmit = {handleSubmit}
      >
        <FormGroup controlId='question-input'>
          <ControlLabel><h5>What is the question?</h5></ControlLabel>
          <FormControl id='question-input' name='question' type="string"/>
        </FormGroup>
        <FormGroup controlId='type-input'>
          <ControlLabel><h5>What type of answer does this question have?</h5></ControlLabel>
          <RadioGroup id='type-input' name='type' inline defaultValue={'single'} onChange={handleTypeChange}>
            <Radio value='single' name='single'>Single answer</Radio>
            <Radio value='multiple' name='multiple '>Multiple answers</Radio>
          </RadioGroup>
        </FormGroup>
        <FormGroup>
          <ControlLabel><h5>What are the answers?</h5></ControlLabel>
          <Button appearance="primary" onClick={handleNewAnswer}>New Answer</Button>
          <br></br>
          <br></br>
          <List bordered hover>
            {answers.map((item, idx) => (
              <List.Item key={item.id} index={idx}>
                <FlexboxGrid justify="space-between">
                  <FlexboxGrid.Item>
                  <h5>Answer:</h5>
                    <Input placeholder={item.answer} onChange={e => handleEditAnswer(e, item.id)} style={{ maxWidth: '300%' }} />
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item>
                    <Toggle size ="lg" checkedChildren="Correct" unCheckedChildren="Incorrect" defaultChecked={item.is_correct} onChange={e => handleCorrectAnswerChange(e, item.id)}/>
                    <Button appearance="subtle" onClick={() => handleDeleteAnswer(item.id)}>Delete Answer</Button>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </List.Item>
            ))}
          </List>
        </FormGroup>
        <FormGroup controlId='points-input'>
          <ControlLabel><h5>How many points is this question worth?</h5></ControlLabel>
          <ControlLabel><p>Max 10 points</p></ControlLabel>
          <InputNumber placeholder={questionForm.points} max={10} min={1} id='points-input' name='points' onChange={handlePointChange} />
        </FormGroup>
        <FormGroup controlId='time-input'>
          <ControlLabel><h5>How long will the player have to answer the question?</h5></ControlLabel>
          <ControlLabel><p>In seconds (max 300s/5mins)</p></ControlLabel>
          <InputNumber placeholder={questionForm.time} max={300} min={3} id='time-input' name='time' onChange={handleTimeChange} />
        </FormGroup>
        <FormGroup controlId='media-input'>
          <ControlLabel><h5>Optional video or image</h5></ControlLabel>
          <ControlLabel><p>The video or the image will be displayed during the question</p></ControlLabel>
          <RadioGroup id='media-input' name='media' inline defaultValue={questionForm.mediainput} onChange={handleMediaChange}>
            <Radio value='noneinput' name='noneinput'>None</Radio>
            <Radio value='videoinput' name='videoinput'>Video</Radio>
            <Radio value='imageinput' name='imageinput '>Image</Radio>
          </RadioGroup>
        </FormGroup>

        {mediaType === 'noneinput'
          ? (
          <div>
            <h5>No optional image or video selected</h5>
            <br></br>
            <br></br>
          </div>
            )
          : (
              mediaType === 'videoinput'
                ? (
              <FormGroup controlId='video-input'>
                <ControlLabel><h5>Optional youtube video link:</h5></ControlLabel>
                <FormControl id="video-input" name="video" onChange={handleVideoChange}/>
              </FormGroup>)
                : (
              <FormGroup controlId='image-input'>
                <ControlLabel><h5>Optional image upload:</h5></ControlLabel>
                <Uploader listType="picture" accept="image/png, image/jpeg" fileListVisible={false} onChange={handleImageChange} />
                <ImageContainer >
                  <img src={questionForm.image} style={{ width: '235px', height: '235px' }} alt='Image preview, reduced size  '/>
                </ImageContainer>
              </FormGroup>))
        }
        <FormGroup>
          <Button appearance="primary" type="submit">Submit</Button>
          <Link to={`/dashboard/edit/${QuizId}`}>
            <Button>Cancel</Button>
          </Link>
        </FormGroup>
      </Form>
    </QuestionEditPanel>
  )
}
