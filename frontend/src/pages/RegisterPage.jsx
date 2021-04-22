import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Form,
  FormGroup,
  Schema,
  ControlLabel,
  FormControl,
  Button,
  Divider,
  Alert
} from 'rsuite';

import 'rsuite/dist/styles/rsuite-default.css';
import { MainPageContainer, RegPanel } from '../style';
const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address')
    .isRequired('An email is required'),
  password: StringType()
    .isRequired('A password is required')
    .minLength(3, 'Please enter atleast 3 characters for your password'),
  name: StringType()
    .isRequired('A name is required')
});

function register (email, password, name) {
  return fetch(new URL('admin/auth/register', 'http://localhost:5005/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  }).then((data) => {
    if (data.status === 200) {
      return data.json();
    }
    return data.json();
  });
}

export default function RegisterPage () {
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' })
  const history = useHistory();
  const handleSubmit = () => {
    const check = model.check(registerForm);
    if (check.email.hasError) {
      Alert.error(check.email.errorMessage, 3000);
      return;
    }
    if (check.password.hasError) {
      Alert.error(check.password.errorMessage, 3000);
      return;
    }
    if (check.name.hasError) {
      Alert.error(check.password.errorMessage, 3000);
      return;
    }
    register(registerForm.email, registerForm.password, registerForm.name).then((data) => {
      if (data.error) {
        Alert.error(data.error, 3000);
      } else {
        history.push('/login');
      }
    })
  }
  return (
    <MainPageContainer>
      <RegPanel header={<h2>Register for an account</h2>} shaded>
        <h5>Account is required to create and host quizzes</h5>
        <Form
          model = {model}
          fluid
          layout = 'vertical'
          onSubmit = {handleSubmit}
          formValue = {registerForm}
          onChange = {newValue => setRegisterForm(newValue)}
        >
          <FormGroup controlId='name-input'>
            <ControlLabel><h4>Name</h4></ControlLabel>
            <FormControl id='name-input' name='name'/>
          </FormGroup>
          <FormGroup controlId='email-input'>
            <ControlLabel><h4>Email</h4></ControlLabel>
            <FormControl id='email-input' name='email'/>
          </FormGroup>
          <FormGroup controlId='password-input'>
            <ControlLabel><h4>Password</h4></ControlLabel>
            <FormControl id='password-input' name='password' type='password'/>
          </FormGroup>
          <FormGroup>
              <Button style={{ margin: '10px' }} appearance="primary" type="submit">Register</Button>
              <Link style={{ margin: '10px' }} to="/login">Login here!</Link>
              <Divider>or</Divider>
              <Link to="/">Join a game!</Link>
          </FormGroup>
        </Form>
      </RegPanel>
    </MainPageContainer>
  )
}
