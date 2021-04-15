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
  Button
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';
const { StringType, NumberType } = Schema.Types;
// import useToken from '../utils/useToken';

export default function EditQuestionPage ({ handleNew }) {
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
    answers: [],
    points: 1,
    time: 30,
    image: null,
    video: '',
  });

  const handleSubmit = () => {

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
        onChange = {newValue => setQuestionForm(newValue)}
        onSubmit = {handleSubmit}
      >
        <FormGroup controlId='question-input'>
          <ControlLabel><h5>What is the question?</h5></ControlLabel>
          <FormControl id='question-input' name='question' type="string"/>
        </FormGroup>
        <FormGroup controlId='type-input'>
          <ControlLabel><h5>What type of answer does this question have?</h5></ControlLabel>
          <RadioGroup id='type-input' name='type' inline>
            <Radio value='single-answer'>Single answer</Radio>
            <Radio value='multiple-answer'>Multiple answers</Radio>
          </RadioGroup>
        </FormGroup>
        <FormGroup controlId='points-input'>
          <ControlLabel><h5>How many points is this question worth?</h5></ControlLabel>
          <ControlLabel><p>Max 10 points</p></ControlLabel>
          <InputNumber defaultValue={1} max={10} min={1} id='points-input' name='points'/>
        </FormGroup>
        <FormGroup controlId='time-input'>
          <ControlLabel><h5>How long will the player have to answer the question?</h5></ControlLabel>
          <ControlLabel><p>In seconds (max 300s/5mins)</p></ControlLabel>
          <InputNumber defaultValue={30} max={300} min={3} id='time-input' name='time'/>
        </FormGroup>
        <FormGroup controlId='video-input'>
          <ControlLabel><h5>Optional youtube video link:</h5></ControlLabel>
          <ControlLabel><p>Video will be displayed during the question</p></ControlLabel>
          <FormControl id="video-input" name="video" type="string"/>
        </FormGroup>
        <FormGroup controlId='image-input'>
          <ControlLabel><h5>Optional image upload:</h5></ControlLabel>
          <ControlLabel><p>Image will be displayed during the question<br></br>The video takes priority over image</p></ControlLabel>
          <FormControl id="image-input" name="video" type="string"/>
        </FormGroup>
        <FormGroup controlId='image-input'>
          <ControlLabel><h5>Optional image upload:</h5></ControlLabel>
          <ControlLabel><p>Image will be displayed during the question<br></br>The video takes priority over image</p></ControlLabel>
          <FormControl id="image-input" name="video" type="string"/>
        </FormGroup>
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

EditQuestionPage.propTypes = {
  handleNew: PropTypes.func.isRequired,
}
