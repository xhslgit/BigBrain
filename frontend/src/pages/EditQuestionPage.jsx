import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Form,
  FormGroup,
  Schema,
  ControlLabel,
  FormControl,
  Panel,
  RadioGroup,
  Radio,
  InputNumber,
  Button,
  Uploader
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import { fileToDataUrl } from '../utils/helpers';
const { StringType, NumberType } = Schema.Types;
// import useToken from '../utils/useToken';

export default function EditQuestionPage () {
  const model = Schema.Model({
    question: StringType().isRequired('What is your question?'),
    type: StringType().isRequired('What type is your question?'),
    points: NumberType()
      .isInteger('Please enter an integer')
      .isRequired('How much is your question worth?'),
    time: NumberType()
      .isInteger('Please enter an integer')
      .isRequired('How long will this question last for?'),
    image: null,
    video: null
  });
  // const token = useToken().token;
  const { QuizId, QuestionId } = useParams();
  const [questionForm, setQuestionForm] = useState({
    id: QuestionId,
    question: '',
    type: '',
    points: 1,
    time: 30,
    video: '',
    image: '',
    answers: [],
  });
  const [mediaType, setMediaType] = useState('videoinput');
  const handleSubmit = () => {
    console.log(questionForm);
  }

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
    console.log(e);
    setMediaType(e);
  }

  const handleImageChange = e => {
    console.log(e);
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
  return (
    <Panel shaded header={<h1>Edit Question</h1>}>
      <h1>{QuizId}</h1>
      <h1>{QuestionId}</h1>
      <Form
        model = {model}
        fluid
        layout = 'vertical'
        formValue = {questionForm}
        onChange = {newValue => {
          setQuestionForm(newValue);
          console.log(newValue);
        }}
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
        <FormGroup controlId='points-input'>
          <ControlLabel><h5>How many points is this question worth?</h5></ControlLabel>
          <ControlLabel><p>Max 10 points</p></ControlLabel>
          <InputNumber defaultValue={1} max={10} min={1} id='points-input' name='points' onChange={handlePointChange} />
        </FormGroup>
        <FormGroup controlId='time-input'>
          <ControlLabel><h5>How long will the player have to answer the question?</h5></ControlLabel>
          <ControlLabel><p>In seconds (max 300s/5mins)</p></ControlLabel>
          <InputNumber defaultValue={30} max={300} min={3} id='time-input' name='time' onChange={handleTimeChange} />
        </FormGroup>
        <FormGroup controlId='media-input'>
          <ControlLabel><h5>Optional video or image</h5></ControlLabel>
          <ControlLabel><p>The video or the image will be displayed during the question</p></ControlLabel>
          <RadioGroup id='media-input' name='media' inline defaultValue={'videoinput'} onChange={handleMediaChange}>
            <Radio value='videoinput' name='videoinput'>Video</Radio>
            <Radio value='imageinput' name='imageinput '>Image</Radio>
          </RadioGroup>
        </FormGroup>
        {mediaType === 'videoinput'
          ? (
              <FormGroup controlId='video-input'>
                <ControlLabel><h5>Optional youtube video link:</h5></ControlLabel>
                <FormControl id="video-input" name="video" type="string"/>
              </FormGroup>)
          : (
              <FormGroup controlId='image-input'>
                <ControlLabel><h5>Optional image upload:</h5></ControlLabel>
                <Uploader listType="picture" accept="image/png, image/jpeg" fileListVisible={false} onChange={handleImageChange} />
              </FormGroup>)
        }
        <FormGroup>
          <Button appearance="primary" type="submit">Submit</Button>
          <Link to={`/dashboard/edit/${QuizId}`}>
            <Button>Cancel</Button>
          </Link>
        </FormGroup>
      </Form>
    </Panel>
  )
}
